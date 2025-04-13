import React from 'react';

/**
 * ToolsLogo Component
 * Displays a section showcasing tools and frameworks compatible with Provibe.
 * Assumes Tailwind CSS and DaisyUI are configured globally in the project.
 */
export function ToolsLogo() {
  return (
    // Section Container - Mimics the structure from the original HTML
    // Note: The gradient class 'bg-linear-to-t' and theme variables (--b1, --b3, --p, --su, --in, --bc)
    // should be defined globally in your Tailwind config or CSS setup.
    <div className="from-base-100 to-base-300 relative flex min-h-[100vh] items-center justify-center bg-linear-to-t py-16 overflow-hidden">
      {/* Background Blur Blobs (Decorative) */}
      <div className="bg-primary pointer-events-none absolute end-1/5 -top-1/2 aspect-square w-full rounded-full opacity-5 blur-3xl xl:opacity-10"></div>
      <div className="bg-success pointer-events-none absolute bottom-[-60%] left-1/2 aspect-square w-2/3 -translate-x-1/2 rounded-full border-2 opacity-10 blur-3xl xl:opacity-20"></div>
      <div className="bg-info pointer-events-none absolute bottom-[-80%] left-0 aspect-square w-1/2 rounded-full opacity-10 blur-3xl xl:opacity-20"></div>

      {/* Content Container */}
      <div className="relative z-10 flex max-w-[100rem] flex-col-reverse items-center justify-center gap-10 p-4 md:gap-20 md:p-10 xl:flex-row-reverse xl:p-20">
        
        {/* Text Content Block */}
        <div className="xl:w-1/2">
          {/* Note: 'font-title' class should be defined in your global styles or Tailwind config if it's custom */}
          <h2 className="font-title text-center leading-none xl:text-start">
            <span className="text-[clamp(2rem,6vw,3.5rem)] font-black block">Works with</span>
            <span className="text-[clamp(2rem,6vw,3.5rem)] font-black block">your favourite</span>
            <span className="text-[clamp(2rem,6vw,3.5rem)] font-light block">tools</span>
          </h2>
          <div className="h-8 md:h-10"></div> {/* Spacer */}

          {/* Explanation Paragraphs - !! IMPORTANT: Replace placeholder text below !! */}
          <p className="text-base-content/70 mb-4 text-center text-lg font-light md:text-xl xl:text-start">
            Provibe enhances your development workflow by providing [describe core function - e.g., ready-made components, advanced utilities]. It's built with pure CSS, ensuring compatibility across all JavaScript frameworks without needing a JS bundle file.
          </p>
          <p className="text-base-content/70 mb-6 text-center text-lg font-light md:text-xl xl:text-start">
            Install Provibe as a dev dependency (`npm install --save-dev provibe`) and start using its class names in your HTML, just like any other utility or component class.
          </p>
          {/* End of placeholder text */}

          <div className="h-8 md:h-10"></div> {/* Spacer */}

          {/* Call to Action Button */}
          <div className="flex w-full justify-center xl:justify-start">
            {/* Make sure the link destination is correct */}
            <a href="/docs/provibe/how-to-use" className="btn btn-lg btn-wide btn-outline group">
              How to use?
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 md:inline-block rtl:rotate-180 group-hover:rtl:-translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Visual/Logo Block */}
        <div className="pointer-events-none relative z-1 shrink-0 xl:w-1/3">
          <div className="grid max-w-sm grid-cols-3 gap-4 px-10 pt-10 md:max-w-md md:grid-cols-4 md:gap-6 xl:px-6 xl:pt-0 [&>*:nth-child(2n-1)]:-translate-y-[calc(50%+0.5rem)] md:[&>*:nth-child(2n-1)]:-translate-y-[calc(50%+0.75rem)]">
            
            {/* Placeholder Logos - !! IMPORTANT: Replace with actual logos !! */}
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 1" src="https://placehold.co/96x96/EEE/333?text=Logo+1" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 2" src="https://placehold.co/96x96/DDD/333?text=Logo+2" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 3" src="https://placehold.co/96x96/EEE/333?text=Logo+3" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 4" src="https://placehold.co/96x96/DDD/333?text=Logo+4" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 5" src="https://placehold.co/96x96/EEE/333?text=Logo+5" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 6" src="https://placehold.co/96x96/DDD/333?text=Logo+6" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 7" src="https://placehold.co/96x96/EEE/333?text=Logo+7" />
            <img loading="lazy" width="96" height="96" className="aspect-square w-full opacity-80 transition-opacity hover:opacity-100" alt="Compatible Tool 8" src="https://placehold.co/96x96/DDD/333?text=Logo+8" />
            {/* End of placeholder logos */}

          </div>
        </div>
      </div>
    </div>
  );
}
