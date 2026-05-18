export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Page title skeleton */}
            <div className="h-9 w-64 bg-white/10 rounded-lg" />

            {/* Content skeleton */}
            <div className="space-y-4">
                <div className="h-16 w-full bg-white/5 rounded-lg border border-white/10" />
                <div className="h-32 w-full bg-white/5 rounded-lg border border-white/10" />
                <div className="h-32 w-full bg-white/5 rounded-lg border border-white/10" />
                <div className="h-32 w-full bg-white/5 rounded-lg border border-white/10" />
            </div>
        </div>
    );
}
