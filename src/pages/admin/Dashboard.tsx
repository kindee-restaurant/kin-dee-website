import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash } from "lucide-react"; // Added Pencil, Trash

interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    booking_date: string;
    booking_time: string;
    guests: number;
    message: string;
    status: "pending" | "confirmed" | "rejected" | "cancelled";
    created_at: string;
}

const Dashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    // Add Booking State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newBooking, setNewBooking] = useState({
        name: "",
        email: "",
        phone: "",
        booking_date: "",
        booking_time: "",
        guests: 2,
        message: "",
        status: "confirmed" as const
    });

    // Edit Booking State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    // ... fetchBookings ...
    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error fetching bookings",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setBookings(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: Booking["status"]) => {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

        const { error } = await supabase
            .from("bookings")
            .update({ status })
            .eq("id", id);

        if (error) {
            // Revert on error
            fetchBookings();
            toast({
                title: "Error updating status",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Status updated",
                description: `Booking marked as ${status}`,
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        // Optimistic update
        const previousBookings = [...bookings];
        setBookings(prev => prev.filter(b => b.id !== id));

        const { error } = await supabase.from("bookings").delete().eq("id", id);

        if (error) {
            // Revert
            setBookings(previousBookings);
            toast({
                title: "Error deleting booking",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Booking deleted",
                description: "The booking has been permanently removed.",
            });
        }
    };

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("bookings")
            .insert([newBooking])
            .select();

        if (error) {
            toast({
                title: "Error adding booking",
                description: error.message,
                variant: "destructive",
            });
        } else {
            if (data) {
                setBookings(prev => [data[0] as Booking, ...prev]);
            }
            toast({
                title: "Success",
                description: "Booking added successfully",
            });
            setIsAddDialogOpen(false);
            setNewBooking({
                name: "",
                email: "",
                phone: "",
                booking_date: "",
                booking_time: "",
                guests: 2,
                message: "",
                status: "confirmed"
            });
        }
    };

    const openEditDialog = (booking: Booking) => {
        setEditingBooking({ ...booking });
        setIsEditDialogOpen(true);
    };

    const handleEditBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBooking) return;

        const { id, created_at, ...updates } = editingBooking;

        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
        setIsEditDialogOpen(false);

        const { error } = await supabase
            .from("bookings")
            .update(updates)
            .eq("id", id);

        if (error) {
            // Revert
            fetchBookings();
            toast({
                title: "Error updating booking",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({ title: "Success", description: "Booking updated successfully" });
            setEditingBooking(null);
        }
    };


    const filteredBookings = bookings.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Bookings Dashboard</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Booking
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Add Manual Booking</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddBooking} className="space-y-4">
                            <div>
                                <Label>Guest Name</Label>
                                <Input
                                    value={newBooking.name}
                                    onChange={e => setNewBooking({ ...newBooking, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={newBooking.email}
                                        onChange={e => setNewBooking({ ...newBooking, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input
                                        type="tel"
                                        value={newBooking.phone}
                                        onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={newBooking.booking_date}
                                        onChange={e => setNewBooking({ ...newBooking, booking_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Time</Label>
                                    <Input
                                        type="time"
                                        value={newBooking.booking_time}
                                        onChange={e => setNewBooking({ ...newBooking, booking_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Guests</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={newBooking.guests}
                                    onChange={e => setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Notes (Optional)</Label>
                                <Textarea
                                    value={newBooking.message}
                                    onChange={e => setNewBooking({ ...newBooking, message: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Create Booking</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                        </DialogHeader>
                        {editingBooking && (
                            <form onSubmit={handleEditBooking} className="space-y-4">
                                <div>
                                    <Label>Guest Name</Label>
                                    <Input
                                        value={editingBooking.name}
                                        onChange={e => setEditingBooking({ ...editingBooking, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={editingBooking.email}
                                            onChange={e => setEditingBooking({ ...editingBooking, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            type="tel"
                                            value={editingBooking.phone}
                                            onChange={e => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={editingBooking.booking_date}
                                            onChange={e => setEditingBooking({ ...editingBooking, booking_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Time</Label>
                                        <Input
                                            type="time"
                                            value={editingBooking.booking_time}
                                            onChange={e => setEditingBooking({ ...editingBooking, booking_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Guests</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={editingBooking.guests}
                                            onChange={e => setEditingBooking({ ...editingBooking, guests: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={editingBooking.status}
                                            onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value as Booking["status"] })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Notes (Optional)</Label>
                                    <Textarea
                                        value={editingBooking.message}
                                        onChange={e => setEditingBooking({ ...editingBooking, message: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">Update Booking</Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Search bookings..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading bookings...
                                </TableCell>
                            </TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">{booking.booking_date}</div>
                                        <div className="text-sm text-muted-foreground">{booking.booking_time.slice(0, 5)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{booking.name}</div>
                                        <div className="text-sm text-muted-foreground">{booking.email}</div>
                                        <div className="text-sm text-muted-foreground">{booking.phone}</div>
                                        {booking.message && (
                                            <div className="text-xs text-muted-foreground mt-1 italic">"{booking.message}"</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{booking.guests}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            booking.status === 'confirmed' ? 'default' :
                                                booking.status === 'pending' ? 'secondary' :
                                                    'destructive'
                                        }>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2 mr-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                        onClick={() => updateStatus(booking.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => openEditDialog(booking)}
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                onClick={() => handleDelete(booking.id)}
                                                title="Delete"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Dashboard;
