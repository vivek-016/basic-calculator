import React from 'react'
import Calculator from './components/calculator'

const App = () => {
  return(
    // Container
    <div className='Container w-full h-screen flex items-center justify-center bg-linear-to-br from-fuchsia-300 to-fuchsia-700'>

      <Calculator/>

    </div>
  )
}

export default App
