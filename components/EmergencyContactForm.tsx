"use client";

import { useState } from 'react';
import { User, Phone, Save, X } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/constants';

interface EmergencyContactFormProps {
    onClose?: () => void;
}

export function EmergencyContactForm({ onClose }: EmergencyContactFormProps) {
    const { state, setEmergencyContact } = useSession();
    const [name, setName] = useState(state.emergencyContact?.name || '');
    const [phone, setPhone] = useState(state.emergencyContact?.phone || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phone) {
            setEmergencyContact(name, phone);
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                if (onClose) onClose();
            }, 1500);
        }
    };

    return (
        <div className="w-full space-y-8 animate-reveal">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Emergency Contact</h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Secondary link for location sharing</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="CONTACT NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 px-12 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="tel"
                            placeholder="PHONE NUMBER"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 px-12 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={cn(
                        "w-full py-5 flex items-center justify-center gap-3 transition-all duration-500",
                        isSaved ? "bg-green-600 text-white" : "bg-primary text-black hover:tracking-[0.2em] font-black uppercase text-xs"
                    )}
                >
                    {isSaved ? (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Contact Synchronized</span>
                        </>
                    ) : (
                        <span>Save Secure Link</span>
                    )}
                </button>
            </form>

            <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-relaxed">
                Note: In extreme emergencies, our system will automatically attempt to share your GPS coordinates with this contact via secure SMS link.
            </p>
        </div>
    );
}
