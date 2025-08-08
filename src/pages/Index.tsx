import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // SEO: Title, meta, canonical, structured data
    document.title = 'LinkLight Hub – Save, organize, and find your links fast';

    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'LinkLight Hub is a simple SaaS to save, tag, and search your favorite links. Stay organized and find anything in seconds.');
    document.head.appendChild(metaDesc);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + '/');
    document.head.appendChild(canonical);

    const jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'LinkLight Hub',
      applicationCategory: 'ProductivityApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Save, tag, and search your links fast.'
    });
    document.head.appendChild(jsonLd);

    return () => {
      jsonLd.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">LinkLight Hub</Link>
          <nav className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Organize your web. Find anything in seconds.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Save links with categories and descriptions. Powerful search and a fast command palette keep you in flow.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link to="/auth">Start free</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="#features">See features</a>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> No credit card required
                <Shield className="h-4 w-4 text-primary" /> Secure with Supabase
              </div>
            </div>
            <div className="rounded-xl border p-6 bg-card shadow-sm">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 grid place-items-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Clean, fast, and minimal interface focused on your links.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border p-6 bg-card">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">Blazing quick</h3>
              <p className="mt-1 text-sm text-muted-foreground">Command palette and keyboard shortcuts keep you moving.</p>
            </div>
            <div className="rounded-xl border p-6 bg-card">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">Organized by design</h3>
              <p className="mt-1 text-sm text-muted-foreground">Categories, descriptions, and search built in.</p>
            </div>
            <div className="rounded-xl border p-6 bg-card">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">Secure</h3>
              <p className="mt-1 text-sm text-muted-foreground">Powered by Supabase auth and Row Level Security.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to get organized?</h2>
            <p className="mt-2 text-muted-foreground">Join now and start saving your web in one place.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/auth">Create your account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app">Open the app</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} LinkLight Hub</span>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <Link to="/auth" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
