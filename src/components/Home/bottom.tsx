'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function Bottom() {
  const t = useTranslations();

  return (
    <section id="home-section-6" className="bottom-section home-section-6 bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 py-20">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-auto text-[30px] lg:text-[46px] xl:text-[60px]">
            <div>{t('bottom.text1')}</div>
            <div className="">{t('bottom.text2')}</div>
          </div>
          <div className="w-full lg:w-auto text-center lg:text-start">
            <Button href="/" className="text-xl font-light text-white px-10 md:px-15 py-3 md:py-4 mt-10 lg:mt-0" target="_blank">{t('bottom.getSupport')}</Button>
          </div>
        </div>
        <div className="mt-10 md:mt-20 flex flex-wrap justify-center lg:justify-end">
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/ins.png" alt="ins" />
          </a>
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/tg.png" alt="tg" />
          </a>
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/x.png" alt="x" />
          </a>
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/youtube.png" alt="youtube" />
          </a>
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/fb.png" alt="fb" />
          </a>
          <a className="block opacity-60 hover:opacity-100 mx-1 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/threads.png" alt="threads" />
          </a>
        </div>
      </div>
    </section>
  );
}
