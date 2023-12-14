import PropsTypes from 'prop-types'

// eslint-disable-next-line react/prop-types
export default function Card({ index, isi_pernyataan, children, is_answered }) {
  return (
    <div className="mb-10 bg-slate-50 p-10 rounded-sm">
      <small className={`font-semibold rounded-full px-3 py-1 text-xs 
      ${is_answered != null || is_answered != undefined ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600" }`}>
        {is_answered != null || is_answered != undefined  ? "Sudah terjawab" : "Belum terjawab"}
      </small>
      <div className="bg-slate-50 rounded mt-6 text-2xl font-semibold text-indigo-500 leading-[175%]">
        {`${++index}. ${isi_pernyataan} `}
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

Card.propTypes = {
  index: PropsTypes.number,
  isi_pernyataan: PropsTypes.string,
}