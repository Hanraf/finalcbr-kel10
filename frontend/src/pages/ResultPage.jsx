import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ResultPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  let location = useLocation();
  useEffect(() => {
    setResult(location.state.result)
    setIsLoading(false)
  }, [location]);

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      {isLoading != true ?
        <>
          <main className='flex justify-center gap-24'>
            <section>
              <small className='text-slate-500/80 uppercase tracking-wider text-[10px] font-medium'>
                Data diri
              </small>
              <div className='flex gap-x-10 mt-6'>
                <div>
                  <div className='py-1'>
                    Jenis Kelamin
                  </div>
                  <div className='my-8 py-1'>
                    Umur
                  </div>
                  <div className='py-1'>
                    Kelas
                  </div>
                </div>
                <div>
                  <div className='text-indigo-500 px-2 py-1 text-center font-medium rounded-full bg-indigo-100'>
                    {result.jenis_kelamin == "L" ? "L" : "P"}
                  </div>
                  <div className='my-8 text-indigo-500 px-2 py-1 text-center font-medium rounded-full bg-indigo-100'>
                    {result.umur}
                  </div>
                  <div className='text-indigo-500 px-2 py-1 text-center font-medium rounded-full bg-indigo-100'>
                    {result.kelas}
                  </div>
                </div>
              </div>
            </section>
            <section>
              <small className='text-slate-500/80 uppercase tracking-wider text-[10px] font-medium'>Kepribadian Anda cenderung:</small>
              <h1 className='font-semibold text-5xl w-fit text-indigo-500 my-8 px-6 py-4 rounded-md bg-indigo-100'>
                {result.minat_bakat}
              </h1>
              <div className='text-sm'> Hasil Sørensen–Dice :
                <br />
                <div className='pb-2 text-base text-indigo-500 border-b-2 border-b-indigo-500 font-medium'>
                  {
                    result.hasil_sdc.map((valueOfHasilSdc) => {
                      if (valueOfHasilSdc.minat_bakat == result.minat_bakat) {
                        const hasil = valueOfHasilSdc.sorensen_coefficient * 100;
                        const angka = hasil.toString().substr(0, 5);
                        return " " + Number(angka)
                      }
                    })
                  }%
                  seorang yang
                  {" " + result.minat_bakat}
                </div>
              </div>
            </section>
          </main>
          <div className='mt-24'>
            <Link to={"/"} className='block px-32 py-2 bg-indigo-500 text-slate-100 text-lg font-bold rounded-md hover:-translate-y-2 hover:bg-indigo-500/90 hover:shadow-[rgba(0,_0,_0,_0.25)_0px_15px_24px_-12px] hover:shadow-indigo-500 transition-all'>
              Lakukan tes lagi 🚀
            </Link>
          </div>
        </>
        :
        <></>
      }
    </div>
  )
}