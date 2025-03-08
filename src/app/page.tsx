import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';

import { title, subtitle } from '@/shared/components/primitives';
import { Navbar } from '@/shared/components/navbar';

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Make&nbsp;</span>
          <span className={title({ color: 'violet' })}>beautiful&nbsp;</span>
          <br />
          <span className={title()}>websites regardless of your design experience.</span>
          <div className={subtitle({ class: 'mt-4' })}>Beautiful, fast and modern React UI library.</div>
        </div>

        {/* <div className="flex gap-3">
          <CustomButton />
          <Link
            isExternal
            className={buttonStyles({ variant: 'bordered', radius: 'full' })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div> */}

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing <Code color="primary">app/page.tsx</Code>
            </span>
          </Snippet>
        </div>
      </main>
    </div>
  );
}
