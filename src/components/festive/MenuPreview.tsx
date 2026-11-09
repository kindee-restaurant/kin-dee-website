"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Expand, FileText, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SpecialMenu } from "@/lib/specialMenus";

/** The special menu's image as a framed card; tapping it opens the full menu viewer. */
export const MenuPreviewCard = ({ menu, onOpen }: { menu: SpecialMenu; onOpen: () => void }) => (
    <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full max-w-[190px] sm:max-w-[250px] mx-auto rounded-sm bg-white p-1.5 sm:p-2 shadow-[0_14px_30px_-12px_rgba(60,40,10,0.3)] ring-1 ring-[#c9a14a]/50 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4a33]"
        aria-label={`View the full ${menu.title}`}
    >
        <div className="relative aspect-[2/3] overflow-hidden">
            <Image
                src={menu.image_url!}
                alt={`${menu.title} at Kin Dee, Dublin`}
                fill
                sizes="(max-width: 640px) 190px, 250px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f8f1e3]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1d4a33] shadow-sm">
                <Expand className="w-3 h-3" /> View
            </span>
        </div>
    </button>
);

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const BUTTON_STEPS = [1, 1.5, 2, 3, 4];
const clamp = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

/**
 * Full menu viewer. Zoom with two-finger pinch (touch), the +/- buttons, or double-click (mouse).
 * Pinch is handled here rather than by the browser because the modal blocks native page zoom.
 */
export const MenuLightbox = ({
    menu,
    open,
    onOpenChange,
}: {
    menu: SpecialMenu;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const [zoom, setZoom] = useState(1);
    const zoomRef = useRef(1);
    const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
    const pendingScroll = useRef<{ left: number; top: number } | null>(null);
    const pinch = useRef<{ d0: number; z0: number } | null>(null);
    const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

    useEffect(() => {
        if (!open) {
            zoomRef.current = 1;
            setZoom(1);
        }
    }, [open]);

    // After the image has resized, restore the scroll position that keeps the focal point in place.
    useLayoutEffect(() => {
        if (scroller && pendingScroll.current) {
            scroller.scrollLeft = pendingScroll.current.left;
            scroller.scrollTop = pendingScroll.current.top;
            pendingScroll.current = null;
        }
    }, [zoom, scroller]);

    /** Zoom to `next`, keeping the point (px, py) — relative to the scroller box — fixed on screen. */
    const zoomTo = (next: number, px?: number, py?: number) => {
        const el = scroller;
        const prev = zoomRef.current;
        next = clamp(next);
        if (!el || Math.abs(next - prev) < 0.001) return;
        const cx = px ?? el.clientWidth / 2;
        const cy = py ?? el.clientHeight / 2;
        const ratio = next / prev;
        // Several pinch moves can land before the layout effect runs; build on the not-yet-applied position.
        const base = pendingScroll.current ?? { left: el.scrollLeft, top: el.scrollTop };
        pendingScroll.current = {
            left: (base.left + cx) * ratio - cx,
            top: (base.top + cy) * ratio - cy,
        };
        zoomRef.current = next;
        setZoom(next);
    };

    // Two-finger pinch. Registered natively with passive: false so we can stop the browser's own handling.
    useEffect(() => {
        const el = scroller;
        if (!el) return;
        const onStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                pinch.current = { d0: dist(e.touches[0], e.touches[1]), z0: zoomRef.current };
            }
        };
        const onMove = (e: TouchEvent) => {
            if (!pinch.current || e.touches.length !== 2) return;
            if (e.cancelable) e.preventDefault();
            const [a, b] = [e.touches[0], e.touches[1]];
            const rect = el.getBoundingClientRect();
            const mx = (a.clientX + b.clientX) / 2 - rect.left;
            const my = (a.clientY + b.clientY) / 2 - rect.top;
            zoomTo(pinch.current.z0 * (dist(a, b) / pinch.current.d0), mx, my);
        };
        const onEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) pinch.current = null;
        };
        el.addEventListener("touchstart", onStart, { passive: true });
        el.addEventListener("touchmove", onMove, { passive: false });
        el.addEventListener("touchend", onEnd);
        el.addEventListener("touchcancel", onEnd);
        return () => {
            el.removeEventListener("touchstart", onStart);
            el.removeEventListener("touchmove", onMove);
            el.removeEventListener("touchend", onEnd);
            el.removeEventListener("touchcancel", onEnd);
        };
        // zoomTo only reads refs + scroller, so re-binding on scroller change is enough.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scroller]);

    const step = (dir: 1 | -1) => {
        const z = zoomRef.current;
        const next =
            dir > 0
                ? BUTTON_STEPS.find((s) => s > z + 0.01) ?? MAX_ZOOM
                : [...BUTTON_STEPS].reverse().find((s) => s < z - 0.01) ?? MIN_ZOOM;
        zoomTo(next);
    };

    const onDoubleClick = (e: React.MouseEvent) => {
        if (!scroller) return;
        const rect = scroller.getBoundingClientRect();
        zoomTo(zoomRef.current > 1 ? 1 : 2, e.clientX - rect.left, e.clientY - rect.top);
    };

    // Mouse drag to pan when zoomed (touch pans natively by scrolling).
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || zoomRef.current === 1 || !scroller) return;
        drag.current = { x: e.clientX, y: e.clientY, left: scroller.scrollLeft, top: scroller.scrollTop };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current || !scroller) return;
        scroller.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        scroller.scrollTop = drag.current.top - (e.clientY - drag.current.y);
    };
    const endDrag = () => (drag.current = null);

    const ctrl =
        "w-8 h-8 inline-flex items-center justify-center rounded-full text-[#1d4a33] hover:bg-[#1d4a33]/10 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4a33]";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[96vw] max-w-3xl max-h-[92dvh] p-0 gap-0 flex flex-col overflow-hidden bg-[#f8f1e3] border-[#c9a14a]/60 rounded-lg [&>button:last-child]:hidden">
                <DialogTitle className="sr-only">{menu.title}</DialogTitle>
                <div
                    ref={setScroller}
                    onDoubleClick={onDoubleClick}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerLeave={endDrag}
                    className={`relative flex-1 min-h-0 overflow-auto overscroll-contain select-none ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
                    style={{ touchAction: "pan-x pan-y" }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={menu.image_url!}
                        alt={menu.title}
                        draggable={false}
                        className="block max-w-none h-auto mx-auto mb-14"
                        style={{ width: `${zoom * 100}%` }}
                    />
                </div>

                {/* Close: large and always visible, top-right */}
                <DialogClose
                    className="absolute top-2 right-2 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1d4a33] text-[#f8f1e3] shadow-lg hover:bg-[#163a28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a14a]"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </DialogClose>

                {/* Slim zoom controls, floating bottom-centre */}
                <div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 rounded-full bg-[#f8f1e3]/90 backdrop-blur-sm px-1 py-0.5 shadow-md ring-1 ring-[#c9a14a]/40"
                    role="group"
                    aria-label="Zoom"
                >
                    <button type="button" className={ctrl} onClick={() => step(-1)} disabled={zoom <= MIN_ZOOM + 0.001} aria-label="Zoom out">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-[10px] font-semibold tabular-nums text-[#4a3d2a]">{Math.round(zoom * 100)}%</span>
                    <button type="button" className={ctrl} onClick={() => step(1)} disabled={zoom >= MAX_ZOOM - 0.001} aria-label="Zoom in">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    {menu.pdf_url && (
                        <a href={menu.pdf_url} target="_blank" rel="noopener noreferrer" className={ctrl} aria-label="Open the PDF version">
                            <FileText className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
