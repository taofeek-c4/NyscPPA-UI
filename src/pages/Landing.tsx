import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Shield,
    User,
    Clock,
    FileText,
    CheckCircle,
    ArrowRight,
    LayoutDashboard,

} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation Bar */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">N</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">NYSC PPA</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button asChild>
                                <Link to="/dashboard">
                                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
                    {/* Background Patterns */}
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
                    <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-blue-500/20 opacity-20 blur-[100px]"></div>

                    <div className="container px-4 md:px-6">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            {/* Text Content */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-default">
                                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                        Available for All Batches
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                        Streamline Your <br className="hidden lg:block" />
                                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">
                                            NYSC Experience
                                        </span>
                                    </h1>
                                    <p className="mx-auto lg:mx-0 max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                                        The modern way to log daily activities, track service hours, and manage clearance approvals. Say goodbye to manual paperwork and hello to efficiency.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                                    {user ? (
                                        <Button size="lg" className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all" asChild>
                                            <Link to="/dashboard">
                                                <LayoutDashboard className="mr-2 w-5 h-5" />
                                                Open Dashboard
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button size="lg" className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all" asChild>
                                                <Link to="/register">
                                                    Try Now
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-background/50 backdrop-blur" asChild>
                                                <Link to="/login">
                                                    Login
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                                    <div className="flex -space-x-4 rtl:space-x-reverse">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                                <User className="w-5 h-5 text-muted-foreground/50" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-foreground">Hundreds of Active Users</div>
                                        <div className="text-xs">Trusted by Corps Members across Nigeria</div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Content - Mock UI */}
                            <div className="relative mx-auto lg:ml-auto w-full max-w-[500px] lg:max-w-none hidden md:block">
                                <div className="relative rounded-2xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-2xl p-6 transition-transform hover:scale-[1.01] duration-500">
                                    {/* Header of Mock UI */}
                                    <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                                        <div className="space-y-2">
                                            <div className="h-5 w-32 bg-primary/20 rounded animate-pulse"></div>
                                            <div className="h-3 w-24 bg-muted rounded"></div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-bold text-primary">N</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid Mock */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-medium text-primary">Hours Logged</span>
                                            </div>
                                            <div className="text-2xl font-bold">142.5h</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-medium text-muted-foreground">Pending Logs</span>
                                            </div>
                                            <div className="text-2xl font-bold">2</div>
                                        </div>
                                    </div>

                                    {/* List Mock */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Activity</div>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/40 hover:bg-accent/40 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="h-3 w-32 bg-foreground/10 rounded"></div>
                                                        <div className="h-2 w-20 bg-muted rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="px-2 py-1 rounded text-[10px] bg-green-500/10 text-green-600 font-medium">
                                                    Approved
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -right-4 top-20 rounded-xl bg-background border shadow-xl p-4 animate-bounce duration-[3000ms] hidden lg:block">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Report Generated</p>
                                            <p className="text-xs text-muted-foreground">Monthly Clearance Ready</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12 transform">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                                What To Expect
                            </h2>
                            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                                Designed to handle the specific requirements of the NYSC PPA community development service.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Instant Reports</h3>
                                <p className="text-muted-foreground">
                                    Generate comprehensive monthly PDF reports of your activities with a single click.
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                                <p className="text-muted-foreground">
                                    Log your arrival and departure times accurately. Keep a precise record of your service hours.
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Secure Approvals</h3>
                                <p className="text-muted-foreground">
                                    Supervisors can review, approve, or reject logs directly. Ensure data integrity.
                                </p>
                            </div>


                        </div>
                    </div>
                </section>

                {/* How it Works (Split) */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Corps Member */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    <User className="w-4 h-4" />
                                    For Corps Members
                                </div>
                                <h2 className="text-3xl font-bold">Simplify Your Documentation</h2>
                                <ul className="space-y-4">
                                    {[
                                        "Join your PPA using a unique Organization Code.",
                                        "Log your daily service activities and hours.",
                                        "Track approval status in real-time.",
                                        "Download official monthly reports for your clearance."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Supervisor */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                                    <Shield className="w-4 h-4" />
                                    For Supervisors
                                </div>
                                <h2 className="text-3xl font-bold">Manage With Ease</h2>
                                <ul className="space-y-4">
                                    {[
                                        "Create your PPA profile and generate join codes.",
                                        "View all assigned Corps Members in one dashboard.",
                                        "Review pending logs with one-click approve/reject actions.",
                                        "Monitor attendance and performance effortlessly."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                    <div className="container px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">
                            Join thousands of Corps Members and Supervisors streamlining their NYSC experience today.
                        </p>
                        <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-semibold" asChild>
                            <Link to="/register">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div >
    );
}
