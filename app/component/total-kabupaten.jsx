import React from 'react'

const TotalKabupaten = () => {
  return (
    // <div className='w-80 m-10 ' >
    //     <div className='flex flex-col gap-2'>
    //         <div className='justify-between flex'>
    //         <span>Mandobo</span>
    //         <span>300</span>
    //         </div>
    //         <div className='tooltip tooltip-right' data-tip="50% dari 600">
    //         <progress className="progress h-6 w-100 rounded-sm" value={50} max="100"></progress>
    //         </div>
    //     </div>
    // </div>
    <div className='flex flex-1 w-auto'>
        <div>
        <div className="stats stats-vertical shadow w-auto h-80">
            <div className="stat items-center justify-center flex flex-col">
                <div className="stat-title ">Total suara kabupaten</div>
                <div className="stat-value font-bold text-9xl text-primary">100000</div>
                <div className="stat-desc">Terakhir update: 29-11-2024 12:30</div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default TotalKabupaten