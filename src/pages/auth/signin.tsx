import * as Yup from "yup"

import { ErrorMessage, Field, Formik } from "formik"
import { getCsrfToken, signIn, useSession } from "next-auth/react"

import { InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "authenticated") {
    router.push("/app")
  }

  return (
    <>
      {status === "unauthenticated" && (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md pb-4">
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"> */}
            <Formik
              initialValues={{ email: "", password: "", tenantKey: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .max(30, "Must be 30 characters or less")
                  .email("Invalid email address")
                  .required("Please enter your email"),
                password: Yup.string().required("Please enter your password"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                const res = await signIn("credentials", {
                  redirect: false,
                  email: values.email,
                  password: values.password,
                  callbackUrl: `${window.location.origin}/app`,
                })

                if (res?.error) {
                  alert(res.error)
                }

                // if (res?.url) router.push(res.url)

                // setSubmitting(false)
              }}
            >
              {(formik) => (
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                  <div className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                    <div className="mb-4">
                      <label htmlFor="email" className="text-sm font-bold uppercase text-gray-600">
                        Email
                        <Field
                          name="email"
                          aria-label="enter your email"
                          aria-required="true"
                          type="text"
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </label>

                      <div className="text-sm text-red-600">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="password" className="text-sm font-bold uppercase text-gray-600">
                        password
                        <Field
                          name="password"
                          aria-label="enter your password"
                          aria-required="true"
                          type="password"
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </label>

                      <div className="text-sm text-red-600">
                        <ErrorMessage name="password" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {formik.isSubmitting ? "Please wait..." : "Sign In"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export const getServerSideProps = async (context: any) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
