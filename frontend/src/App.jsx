/* eslint-disable no-unused-vars */
import axios from "axios"
import { useEffect, useState } from "react"
import Card from "./components/Card"

export default function App() {
  const [question, setQuestion] = useState(null)
  const [answer, setIsAnswer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ageAnswer, setAgeAnswer] = useState('')
  const [classAnswer, setClassAnswer] = useState('')
  const [genderAnswer, setGenderAnswer] = useState('')

  function handleAnswer(idVal, isYes) {
    const angka = idVal.slice(1);
    const number = Number(angka);
    const hasil = number - 1;
    let newAnswer

    if (isYes == "true") {
      newAnswer = answer.map((value, index) => {
        if (index === hasil) {
          return true
        }
        else {
          return value
        }
      })
    }
    else if (isYes == "false") {
      newAnswer = answer.map((value, index) => {
        if (index === hasil) {
          return false
        }
        else {
          return value
        }
      })
    }
    setIsAnswer(newAnswer)
  }

  function handleSubmit() {
    let newAnswer = []
    for (let index = 0; index < answer.length; index++) {
      if (answer[index] == true) {
        let temptIdPernyataan
        temptIdPernyataan = "C" + ++index
        newAnswer.push(temptIdPernyataan)
      }
    }
    axios.post('http://localhost:8081/Api', {
      "umur": ageAnswer,
      "jenis_kelamin": genderAnswer,
      "kelas": classAnswer,
      "id_pernyataan": newAnswer
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }


  useEffect(() => {
    axios.get('http://localhost:8081/Api').then((response) => {
      setQuestion(response.data['pernyataan siswa'])
      let element = [];
      for (let index = 0; index < response.data['pernyataan siswa'].length; index++) {
        element.push(false)
      }
      setIsAnswer(element)
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])



  return (
    isLoading != true &&
    <div className="w-full min-h-screen bg-slate-100 px-20 relative flex gap-10">
      <nav className="w-full h-20 flex justify-between items-center px-20 bg-slate-50 border-b border-slate-300 fixed top-0 left-0 right-0 z-20">
        <h1 className="font-semibold text-indigo-500 text-xl">
          Sørensen–Dice coefficient
        </h1>
      </nav>
      <aside className="sticky top-32 left-0 bg-slate-50 w-80 h-fit p-10 text-center">
        <small>Soal terjawab:</small>
        <h3 className="text-7xl text-rose-500 my-2">
          0/21
        </h3>
      </aside>
      <main className="flex-1 min-h-screen py-12">
        <section className="mt-20">
          <div className="mb-6 font-semibold text-3xl">🧬 Biodata diri 🧬</div>
          <Card index={0} isi_pernyataan={"Umur"} >
            <div className="flex items-center gap-4">
              <input className="block w-full px-2 py-1 border outline-none focus:outline-indigo-500 focus:border-indigo-300" type="number" value={ageAnswer}
                onChange={(e) => {
                  setAgeAnswer(e.target.value)
                }} />
            </div>
          </Card>
          <Card index={1} isi_pernyataan={"Jenis Kelamin"} >
            <div className="flex items-center gap-4">
              <input className="w-5 aspect-square cursor-pointer accent-indigo-500" type="radio" name='gender' value={'L'}
                onChange={(e) => {
                  setGenderAnswer(e.target.value)
                }} id="L" />
              <label htmlFor="L" className="cursor-pointer hover:font-medium">Laki - laki</label>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <input className="w-5 aspect-square cursor-pointer accent-indigo-500" type="radio" name='gender' value={'P'} onChange={(e) => {
                setGenderAnswer(e.target.value)
              }} id="P" />
              <label htmlFor="P" className="cursor-pointer hover:font-medium">Perempuan</label>
            </div>
          </Card>
          <Card index={2} isi_pernyataan={"Kelas"} >
            <div className="flex items-center gap-4">
              <input className="block w-full px-2 py-1 border outline-none focus:outline-indigo-500 focus:border-indigo-300" type="number" value={classAnswer}
                onChange={(e) => {
                  setClassAnswer(e.target.value)
                }} />
            </div>
          </Card>
        </section>
        <section className="mt-16 py-8 border-t border-slate-300">
          <div className="mb-6 font-semibold text-3xl">🤔 Pertanyaan kepribadian 🤔</div>
          {
            question.map((value, index) => {
              return (
                <Card key={index} index={index} isi_pernyataan={value.isi_pernyataan} id_pernyataansiswa={value.id_pernyataansiswa} handleAnswer={handleAnswer} >
                  <div className="flex items-center gap-4">
                    <input className="w-5 aspect-square cursor-pointer accent-indigo-500" type="radio" name={`${value.id_pernyataansiswa}`} value={true}
                      id={`${value.id_pernyataansiswa}-true`} onChange={(e) => {
                        handleAnswer(e.target.name, e.target.value)
                      }} />
                    <label className="cursor-pointer hover:font-medium" htmlFor={`${value.id_pernyataansiswa}-true`}>Iya</label>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <input className="w-5 aspect-square cursor-pointer accent-indigo-500" type="radio" name={`${value.id_pernyataansiswa}`} value={false} id={`${value.id_pernyataansiswa}-false`} onChange={(e) => {
                      handleAnswer(e.target.name, e.target.value)
                    }} />
                    <label className="cursor-pointer hover:font-medium" htmlFor={`${value.id_pernyataansiswa}-false`}>Tidak</label>
                  </div>
                </Card>
              )
            })
          }
        </section>
        <section className="mt-1">
          <button className="w-full rounded block py-2 text-center text-2xl font-bold text-slate-50 bg-indigo-500" onClick={handleSubmit}>
            Kirim
          </button>
        </section>
      </main>
    </div>
  )
}