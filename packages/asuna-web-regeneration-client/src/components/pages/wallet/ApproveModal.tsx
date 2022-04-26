import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import { useAppDispatch } from '../../../store/hooks'
import { ModalActions } from '../../../store/modal'
import { ASUNA_ABI, ASUNA_ADDRESS } from '../../../web3/AsunaContract'
import { HOLDER_ADDRESS } from '../../../web3/HolderContract'

enum Progress {
  init,
  pending
}

function ApproveModal({ children }: React.PropsWithChildren<{}>) {
  const library = useWeb3React().library as ethers.providers.Web3Provider
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState(Progress.init)

  useEffect(() => {
    (async () => {
      try {
        const contract = new ethers.Contract(ASUNA_ADDRESS, ASUNA_ABI, library.getSigner())
        const tx: ethers.providers.TransactionResponse = await contract.setApprovalForAll(HOLDER_ADDRESS, true)

        setStatus(Progress.pending)

        const txr = await tx.wait()

        dispatch(ModalActions.setShow(false))

      } catch (err) {
        dispatch(ModalActions.setError('approval failed'))
        dispatch(ModalActions.setShow(false))
      }
    })()
  }, [])

  return <div className='modal flex justify-center items-center h-190 text-center'>
    {status === Progress.init
      ? <div>
        <h1 className='text-xl leading-loose'>Set approval for Asuna</h1>
        <p>You will only need to approve once per wallet.</p>
      </div>
      : <div>
        <h1 className='text-xl leading-loose'>Approving...</h1>
      </div>
    }

  </div>
}

export default ApproveModal
