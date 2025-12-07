import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Reservations = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: undefined as Date | undefined,
        time: "",
        guests: 2,
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Business Hours Data (for display or validation if needed)
    const [hours, setHours] = useState<any[]>([]);
    useEffect(() => {
        import("@/integrations/supabase/client").then(({ supabase }) => {
            supabase.from("business_hours").select("*").order("display_order")
                .then(({ data }) => { if (data) setHours(data); });
        });
    }, []);

    const timeSlots = [
        "17:00", "17:30", "18:00", "18:30",
        "19:00", "19:30", "20:00", "20:30", "21:00"
    ];


    // ... inside component ...
    const [view, setView] = useState<"book" | "check">("book");
    const [searchQuery, setSearchQuery] = useState("");
    const [bookingStatus, setBookingStatus] = useState<any[] | null>(null);
    const [checking, setChecking] = useState(false);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setChecking(true);
        setBookingStatus(null);

        try {
            const { supabase } = await import("@/integrations/supabase/client");
            const { data, error } = await supabase
                .rpc('get_booking_status', {
                    p_query: searchQuery
                });

            if (error) throw error;

            if (!data || data.length === 0) {
                toast({
                    title: "No booking found",
                    description: "We couldn't find a reservation with those details.",
                    variant: "destructive"
                });
            } else {
                setBookingStatus(data);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setChecking(false);
        }
    };

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleReset = () => {
        setStep(1);
        setFormData(prev => ({ ...prev, name: "", email: "", phone: "", message: "" }));
        setIsSubmitted(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { supabase } = await import("@/integrations/supabase/client");

            if (!formData.date) throw new Error("Please select a date");

            const { error } = await supabase.from("bookings").insert([{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                booking_date: format(formData.date, "yyyy-MM-dd"),
                booking_time: formData.time,
                guests: formData.guests,
                message: formData.message
            }]);

            if (error) throw error;

            toast({
                title: "Reservation Requested!",
                description: "We'll confirm your booking via email shortly.",
            });

            setIsSubmitted(true);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reservations" className="section-padding bg-cream overflow-hidden min-h-[800px] flex items-center">
            <div className="container-custom w-full max-w-5xl px-0 sm:px-6 lg:px-8"> {/* w-full + px-0 for edge-to-edge mobile */}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 animate-fade-in px-4 md:px-2">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-2">Reservations</p>
                        <h2 className="heading-section text-foreground">
                            {view === "book" ? <>Book Your <em>Table</em></> : <>Check <em>Status</em></>}
                        </h2>
                    </div>

                    <button
                        onClick={() => {
                            setView(view === "book" ? "check" : "book");
                            setBookingStatus(null);
                            setSearchQuery("");
                        }}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors border-b border-primary/20 pb-0.5"
                    >
                        {view === "book" ? "Check existing booking →" : "← Book a new table"}
                    </button>
                </div>

                <div className="bg-card rounded-none md:rounded-2xl shadow-none md:shadow-elevated border-y md:border border-border overflow-hidden relative min-h-[500px] flex flex-col transition-all duration-500">

                    {view === "book" ? (
                        <>
                            {isSubmitted ? (
                                <div className="p-4 md:p-10 flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Check className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-display mb-4">Reservation Requested!</h3>
                                    <p className="text-muted-foreground max-w-md mb-8">
                                        Thank you, {formData.name}. We have received your booking request for <strong>{formData.guests} people</strong> on <strong>{formData.date && format(formData.date, "MMMM do")}</strong> at <strong>{formData.time}</strong>.
                                        <br /><br />
                                        We will send a confirmation email to <strong>{formData.email}</strong> shortly.
                                    </p>
                                    <Button onClick={handleReset} variant="outline" className="h-12 px-8">
                                        Make Another Reservation
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Progress Bar */}
                                    <div className="h-1 bg-secondary w-full">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out"
                                            style={{ width: `${(step / 4) * 100}%` }}
                                        />
                                    </div>

                                    <div className="p-4 md:p-10 flex-1 flex flex-col"> {/* Reduced padding p-4 */}
                                        {/* Step Navigation Header */}
                                        <div className="flex justify-between items-center mb-8">
                                            {step > 1 ? (
                                                <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                                                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                                </Button>
                                            ) : <div></div>}
                                            <span className="text-sm font-medium text-muted-foreground">Step {step} of 4</span>
                                        </div>

                                        {/* ... Steps 1, 2, 3, 4 ... */}
                                        {/* STEP 1: GUESTS */}
                                        {step === 1 && (
                                            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500">
                                                <h3 className="text-2xl font-display mb-8 text-center">How many guests?</h3>
                                                <div className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-md"> {/* Reduced gap on mobile */}
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => {
                                                                setFormData({ ...formData, guests: num });
                                                                handleNext();
                                                            }}
                                                            className={cn(
                                                                "aspect-square rounded-xl border-2 flex items-center justify-center text-xl font-display transition-all duration-300 hover:scale-105",
                                                                formData.guests === num
                                                                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                                                                    : "border-border bg-background text-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="mt-8 text-sm text-muted-foreground text-center">
                                                    For groups of 9+, please contact us directly.<br />
                                                    <span className="font-medium text-primary">01 234 5678</span>
                                                </p>
                                            </div>
                                        )}

                                        {/* STEP 2: DATE */}
                                        {step === 2 && (
                                            <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
                                                <h3 className="text-2xl font-display mb-10 text-center">Select a Date</h3> {/* Increased margin */}
                                                <div className="bg-background rounded-xl border border-border p-2 md:p-4 shadow-sm scale-110 md:scale-125 mt-8 mb-4"> {/* Increased top margin */} {/* Reduced padding p-2 */}
                                                    <Calendar
                                                        mode="single"
                                                        selected={formData.date}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                setFormData({ ...formData, date });
                                                                handleNext();
                                                            }
                                                        }}
                                                        disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        className="rounded-md border-none"
                                                    />
                                                </div>
                                                <div className="mt-8 flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-full">
                                                    <Users className="w-4 h-4" />
                                                    <span>{formData.guests} Guests</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: TIME */}
                                        {step === 3 && (
                                            <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500 w-full"> {/* Ensure w-full */}
                                                <h3 className="text-2xl font-display mb-2 text-center">Select a Time</h3>
                                                <p className="text-muted-foreground mb-8 text-center">
                                                    {formData.date ? format(formData.date, "EEEE, MMMM do") : ""}
                                                </p>

                                                <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-md mx-auto"> {/* Centered and full width */}
                                                    {timeSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => {
                                                                setFormData({ ...formData, time });
                                                                handleNext();
                                                            }}
                                                            className={cn(
                                                                "py-3 md:py-4 rounded-lg border text-sm md:text-base font-medium transition-all duration-300",
                                                                formData.time === time
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-background border-border hover:border-primary hover:bg-primary/5"
                                                            )}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 4: DETAILS */}
                                        {step === 4 && (
                                            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 max-w-lg mx-auto w-full">
                                                <div className="text-center mb-8">
                                                    <h3 className="text-2xl font-display mb-2">Final Details</h3>
                                                    <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                                                        <span className="bg-secondary px-3 py-1 rounded-full text-foreground">{formData.guests} Guests</span>
                                                        <span className="bg-secondary px-3 py-1 rounded-full text-foreground">{formData.date ? format(formData.date, "MMM dd") : ""}</span>
                                                        <span className="bg-secondary px-3 py-1 rounded-full text-foreground">{formData.time}</span>
                                                    </div>
                                                </div>

                                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"> {/* Stack fields on mobile */}
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Name</label>
                                                            <Input
                                                                required
                                                                value={formData.name}
                                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                                placeholder="John Doe"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Phone</label>
                                                            <Input
                                                                required
                                                                type="tel"
                                                                value={formData.phone}
                                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                                placeholder="08X XXX XXXX"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Email</label>
                                                        <Input
                                                            required
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="john@example.com"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Special Requests</label>
                                                        <Textarea
                                                            value={formData.message}
                                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                            placeholder="Allergies, occasion, etc."
                                                            rows={3}
                                                            className="resize-none"
                                                        />
                                                    </div>

                                                    <Button type="submit" className="w-full mt-2 h-12 text-lg font-display" disabled={isSubmitting}>
                                                        {isSubmitting ? "Confirming..." : "Confirm Reservation"}
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="p-4 md:p-10 flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 w-full">
                            {!bookingStatus ? (
                                <form onSubmit={handleCheckStatus} className="w-full max-w-lg space-y-8">
                                    <div className="text-center">
                                        <h3 className="text-3xl font-display mb-3">Find Reservation</h3>
                                        <p className="text-muted-foreground">Enter your details to view your current bookings.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium block">Email or Phone Number</label>
                                            <Input
                                                type="text"
                                                required
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="e.g. john@example.com or 0871234567"
                                                className="h-12 text-lg"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-lg" disabled={checking}>
                                        {checking ? "Searching..." : "Check Status"}
                                    </Button>
                                </form>
                            ) : (
                                <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-3xl font-display text-center">Your Bookings</h3>
                                    <div className="grid gap-4">
                                        {bookingStatus.map((booking) => (
                                            <div key={booking.id} className="bg-background border border-border/50 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-sm hover:shadow-md transition-shadow gap-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <CalendarIcon className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-display text-xl mb-1">{format(new Date(booking.booking_date), "MMMM do, yyyy")}</p>
                                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.booking_time.slice(0, 5)}</span>
                                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {booking.guests} Guests</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase",
                                                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                                                        booking.status === "cancelled" || booking.status === "rejected" ? "bg-red-100 text-red-700" :
                                                            "bg-amber-100 text-amber-700"
                                                )}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="mx-auto block" onClick={() => {
                                        setBookingStatus(null);
                                        setSearchQuery("");
                                    }}>Check Another</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reservations;
