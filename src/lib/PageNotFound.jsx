/* ============================================================
   404 PAGE — Branded "lost in the woods" not found page
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <Trees className="w-16 h-16 text-primary/30 mb-4" />
      <h1 className="font-heading text-6xl md:text-8xl tracking-wide text-foreground">404</h1>
      <p className="font-heading text-xl tracking-wider uppercase mt-2 text-muted-foreground">
        Lost In The Woods
      </p>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        This trail doesn't lead anywhere. Let's get you back to camp.
      </p>
      <Button asChild className="mt-6 font-heading tracking-wider uppercase">
        <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
      </Button>
    </div>
  );
}