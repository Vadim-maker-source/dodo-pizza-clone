import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const OrderSuccess = () => {

    const navigate = useNavigate()

    const leavePage = () => {
      navigate("/")
      location.reload()
    }

  return (
    <>
    <title>Успешно | Пиццерия</title>
    <div className="h-full w-full flex items-center justify-center">
        <div className="w-96 lg:w-150 p-10 rounded-xl bg-gray-50 flex flex-col items-center justify-between gap-7">
            <img src="/assets/payment-smile.png" className="rounded-[40px] h-40 w-40 bg-blend-multiply" alt="" />
            <h1 className="font-bold text-3xl">Спасибо за покупку!</h1>
            <p className="font-semibold text-xl text-center">Внимание! Это сайт не существующей пиццерии, а просто проект. Ваши данные защищены и нигде не будут использоваться!</p>
            <button className="w-72 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition font-semibold disabled:bg-gray-300 cursor-pointer px-5 py-5 text-xl flex items-center justify-between" onClick={leavePage}><FaArrowLeft size={20} />  Вернуться на главную</button>
        </div>
    </div>
    </>
  )
}

export default OrderSuccess