'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";
import Modal from 'react-modal'
import Button from '@/components/ui/Button';
import axios from 'axios';
import Footer from '@/components/Footer';

export default function Support() {
  const t = useTranslations();
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [errorStatus, setErrorStatus] = useState(-1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const formItems = ['name', 'email', 'desc', 'platforms', 'expectProfit', 'support', 'visitType'];
  const platforms = ['Android', 'IOS', 'TG', 'Web', 'TikTok', 'Line'];
  const initialForm = {
    name: '',
    email: '',
    desc: '',
    platforms: [],
    expectProfit: '',
    support: '',
    visitType: ''
  }

  const [form, setForm] = useState<any>(initialForm)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
  }

  const handlePlatformToggle = (platform: string) => {
    setForm((prev: { platforms: any[]; }) => {
      const isSelected = (prev.platforms as string[]).includes(platform)
      return {
        ...prev,
        platforms: isSelected
          ? prev.platforms.filter(i => i !== platform)
          : [...prev.platforms, platform],
      }
    })
  }

  const handleReset = () => {
    setForm(initialForm)
  }

  const handleSubmit = async(e: React.FormEvent) => {
    if(submitLoading || !form[formItems[questionIdx]]) return;
    setSubmitLoading(true);
    e.preventDefault()
    console.log('提交数据:', form);

    /*
    await axios({
      method: "post",
      url: "",
      data: form
    })
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setErrorStatus(-1);
      }
      else {
        setErrorStatus(data.status);
      }
      setShowResult(true);
    })
    .catch((err) => {
      console.log(err);
      setErrorStatus(0);
      setShowResult(true);
    })
    */

    setSubmitLoading(false);
    setShowResult(true);
  }

  const handleNext = () => {
    if(form[formItems[questionIdx]].length) {
      setQuestionIdx(questionIdx + 1)
    }
  }

  const handlePrev = () => {
    setQuestionIdx(questionIdx - 1)
  }

  useEffect(() => {
    handleReset();
    setQuestionIdx(0);
    setShowResult(false);
    setErrorStatus(-1);
  }, [])

  return (
    <>
      <div className="support-page w-full h-screen min-h-[760px] pt-12 md:pt-20 bg-[#070709]">
        <div className="relative w-full h-full bg-[#121212] flex items-center overflow-hidden">
          <div className="modal-top absolute top-0 right-0 w-1/2 pl-[30px] lg:pl-[60px]">
            <div className="w-full h-[30px] lg:h-[60px] bg-[#070709]"></div>
            <div className="absolute top-0 left-0 w-0 h-0 border-b-0 border-r-0 border-t-[#070709] border-l-transparent border-t-[30px] border-l-[30px] lg:border-t-[60px] lg:border-l-[60px]"></div>
          </div>
          <img className="absolute bottom-0 md:translate-y-1/2 z-0 w-full" src="/images/bg_roadmap.jpg" />
          <div className="absolute bottom-6 left-0 w-full">
            <div className="mx-auto max-w-[1920px] px-6 md:px-12 py-3 md:py-6">
              <Footer />
            </div>
          </div>
          <div className="flex py-10 justify-center items-center w-full relative z-[2] -mt-10">
            <div className="w-full xl:w-[1000px] 2xl:w-[1200px] px-3 xl:px-0">
              <div className="flex items-center text-white">
                <div className="text-[#febd32] text-xs md:text-sm whitespace-nowrap">{(questionIdx + 1)} / {formItems.length}</div>
                <div className="text-lg md:text-xl ml-3">{t('support.q' + (questionIdx + 1))}</div>
              </div>
              <div className="mt-6">
                <form>
                  <input className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl " + (questionIdx == 0 ? 'block' : 'hidden')} 
                    name="name" value={form.name} onChange={handleChange} placeholder={t('support.placeholder')} />
                  <input className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl " + (questionIdx == 1 ? 'block' : 'hidden')} 
                    name="email" value={form.email} onChange={handleChange} type="email" placeholder={t('support.placeholder')} />
                  <textarea className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl min-h-30 " + (questionIdx == 2 ? 'block' : 'hidden')} 
                    name="desc" value={form.desc} onChange={handleChange} placeholder={t('support.placeholder')} />
                  <div className={(questionIdx == 3 ? 'block' : 'hidden')}>
                    {platforms.map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 cursor-pointer mb-1 overflow-hidden">
                      <input
                        type="checkbox"
                        value={item}
                        checked={(form['platforms']).includes(item)}
                        onChange={() => handlePlatformToggle(item)}
                        name="platforms"
                        className="hidden"
                      />
                      {form['platforms'].includes(item) ? 
                        <div className="rounded w-5 h-5 bg-[#febd32] flex items-center justify-center">
                          <svg viewBox="0 0 1446 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M574.116299 786.736392 1238.811249 48.517862C1272.390222 11.224635 1329.414799 7.827718 1366.75664 41.450462 1403.840015 74.840484 1406.731043 132.084741 1373.10189 169.433699L655.118888 966.834607C653.072421 969.716875 650.835807 972.514337 648.407938 975.210759 615.017957 1012.29409 558.292155 1015.652019 521.195664 982.250188L72.778218 578.493306C35.910826 545.297758 32.859041 488.584019 66.481825 451.242134 99.871807 414.158803 156.597563 410.800834 193.694055 444.202665L574.116299 786.736392Z" fill="#121212"></path></svg>
                        </div>
                        :
                        <div className="rounded w-5 h-5 border border-[#6E4DFF]"></div>
                      }
                      <span className="text-lg md:text-xl">{item}</span>
                    </label>
                    ))}
                  </div>
                  <textarea className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl min-h-30 " + (questionIdx == 4 ? 'block' : 'hidden')} 
                    name="expectProfit" value={form.expectProfit} onChange={handleChange} placeholder={t('support.placeholder')} />
                  <textarea className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl min-h-30 " + (questionIdx == 5 ? 'block' : 'hidden')} 
                    name="support" value={form.support} onChange={handleChange} placeholder={t('support.placeholder')} />
                  <textarea className={"w-full border border-[#6E4DFF] rounded-lg p-2 text-[6E4DFF] text-lg md:text-xl min-h-30 " + (questionIdx == 6 ? 'block' : 'hidden')} 
                    name="visitType" value={form.visitType} onChange={handleChange} placeholder={t('support.placeholder')} />
                  <div className={"mt-6 flex items-center " + (questionIdx == 0 ? "justify-end" : "justify-between")}>
                    {questionIdx != 0 && <Button type="button" onClick={handlePrev} className="text-xl font-light text-white w-40 text-center py-3 md:py-4">{t('support.prev')}</Button>}
                    {questionIdx >= (formItems.length - 1) ? 
                      <Button type="button" onClick={handleSubmit} className={"text-xl font-light text-white w-40 text-center py-3 md:py-4 " + (form[formItems[questionIdx]].length ? "" : "cursor-not-allowed")} disabled={!form[formItems[questionIdx]].length}>
                        {submitLoading && <span className="animate-spin mr-2 w-4 h-4 border-[4px]"></span>}
                        <span>{t('support.submit')}</span>
                      </Button>
                    :
                      <Button type="button" onClick={handleNext} className={"text-xl font-light text-white w-40 text-center py-3 md:py-4 " + (form[formItems[questionIdx]].length ? "" : "cursor-not-allowed")} disabled={!form[formItems[questionIdx]].length}>
                        <span>{t('support.next')}</span>
                      </Button>
                    }
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showResult}
        onRequestClose={() => setShowResult(false)}
        shouldCloseOnOverlayClick={true}
        className="overflow-visible!"
        ariaHideApp={false}
      >
        <div className="support-modal modal-content w-screen bg-white relaitve">
          <div className="flex py-20 justify-center">
            <div className="w-full xl:w-[1000px] 2xl:w-[1200px] px-3 xl:px-0 text-[#6E4DFF] text-lg">
              {errorStatus == -1 ?
                <div className="flex items-center justify-center">
                  <svg className="mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M510.545 28.22c-267.043 0-483.521 216.477-483.521 483.52s216.479 483.521 483.521 483.521 483.52-216.479 483.52-483.521S777.588 28.22 510.545 28.22zM776.855 407.855l-315.37 315.37c-9.763 9.763-22.559 14.645-35.355 14.645-12.796 0-25.592-4.882-35.355-14.645l-176.13-176.13c-19.526-19.525-19.526-51.184 0-70.71 19.526-19.526 51.184-19.527 70.711 0L426.13 617.159l280.015-280.015c19.527-19.526 51.184-19.526 70.711 0C796.382 356.671 796.382 388.329 776.855 407.855z" fill="#6E4DFF"></path></svg>
                  {t('support.successHint')}
                </div>
                : 
                <div className="flex items-center justify-center">
                  <svg className="mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M989.789 857.485 571.231 113.038c-26.448-47.041-92.57-47.041-119.018 0L33.655 857.485c-26.448 47.041 6.612 105.843 59.509 105.843L930.28 963.328C983.177 963.328 1016.238 904.527 989.789 857.485zM467.794 365.381c12.28-14.738 27.887-22.109 46.929-22.109 19.051 0 34.649 7.296 46.937 21.814 12.206 14.555 18.311 32.758 18.311 54.645 0 18.828-25.49 157.304-33.985 258.047l-61.4 0c-7.459-100.741-35.114-239.216-35.114-258.047C449.475 398.176 455.59 380.048 467.794 365.381zM560.791 844.404c-12.911 13.965-28.277 20.929-46.066 20.929-17.781 0-33.156-6.965-46.067-20.929-12.877-13.928-19.283-30.805-19.283-50.63 0-19.713 6.405-36.774 19.283-51.072 12.911-14.297 28.286-21.445 46.067-21.445 17.789 0 33.156 7.149 46.066 21.445 12.877 14.297 19.291 31.357 19.291 51.072C580.082 813.601 573.669 830.477 560.791 844.404z" fill="#6E4DFF"></path></svg>
                  {t('support.errorHint')} {errorStatus > 0 && <span>: {errorStatus}</span>}
                </div>
              }
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
