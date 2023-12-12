import axios from "axios"
import { useEffect, useState } from "react"

export default function App() {
  const [question, setQuestion] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/Api', {
          umur: 18,
          kelas: 11,
          jenis_kelamin: "L",
          id_pernyataan: ['C1', 'C7'],
        });
        setQuestion(response.data['hasil_sdc'])
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    };
    
    fetchData();
  }, []);

  return (
    isLoading !== true &&
    <div className="w-full min-h-screen bg-slate-50">
      <h1>Sorensen</h1>
      {
        question.map((value, index) => {
          return <p key={index}>{value.sorensen_coefficient}</p>
        })
      }
    </div>
  )
}