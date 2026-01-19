export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border border-white/10 bg-[#1a1a2e]">
                    <h2 className="text-xl font-bold text-white mb-2 font-mono">Hero Section</h2>
                    <p className="text-muted-foreground mb-4 font-mono text-sm">Manage main status, location, and role cards.</p>
                    <a href="/admin/hero" className="text-primary hover:underline font-mono text-sm">Manage Hero &rarr;</a>
                </div>

                <div className="p-6 rounded-lg border border-white/10 bg-[#1a1a2e]">
                    <h2 className="text-xl font-bold text-white mb-2 font-mono">About Section</h2>
                    <p className="text-muted-foreground mb-4 font-mono text-sm">Manage intro text, greeting, and personal focus.</p>
                    <a href="/admin/about" className="text-primary hover:underline font-mono text-sm">Manage About &rarr;</a>
                </div>
            </div>
        </div>
    );
}
