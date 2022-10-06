import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

import { AiFillCloseSquare } from "react-icons/ai"
import { classNames } from "../../utils/aux"

interface Props {
  children: React.ReactNode
  title: string
  titleSumary: string

  isOpen: boolean
  onClose: () => void
}

export default function SlideOver(props: Props) {
  const [isLeaving, setIsLeaving] = useState<boolean>(false)

  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="pointer-events-none relative z-10"
        onClose={() => {}}
        onKeyDown={(e: { key: string }) => {
          console.log(e.key)
          if (e.key == "Escape") {
            setIsLeaving(true)
          }
        }}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-[600px]">
                  <div className="h-full overflow-y-scroll bg-white shadow-xl">
                    {/* header */}
                    <div className="overflow-y-auto">
                      <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white"> {props.title} </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => {
                                setIsLeaving(true)
                              }}
                            >
                              <span className="sr-only">Close panel</span>
                              <AiFillCloseSquare className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">{props.titleSumary}</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={classNames(
                        isLeaving
                          ? "absolute top-[25%] left-[25%] z-10 w-80 rounded-sm border bg-gray-100 p-4 shadow-lg"
                          : "hidden"
                      )}
                    >
                      <div className="flex items-center justify-center ">
                        <p>
                          You might have <span className="font-semibold">unsaved</span> changes.
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p>Do you want to leave?</p>
                      </div>
                      <div className="py-2" />
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            setIsLeaving(false)
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            setIsLeaving(false)
                            props.onClose()
                          }}
                        >
                          Leave
                        </button>
                      </div>
                    </div>

                    <div>{props.children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
