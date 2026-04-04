import UserPageImage from "/assets/user-login-page.jpeg"

const AuthLayout = ( { children } : {children : React.ReactNode}) =>{
    return (
        <div className="min-h-screen flex bg-[#0b1120]">
            {/*Left Side */}
            <div className="hidden lg:flex lg: w-1/2 relative overflow-hidden">
                <img 
                    src={UserPageImage}
                    alt="Office"
                    className="absolute w-full h-full object-cover opacity-70"
                />
                <div className="relative z-1 p-16 flex flex-col justify-center bg-linear-to-r from-black/60 to-transparent">
                    <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                        Connect your team <br /> with Enterprise Chat Application.
                    </h1>

                    <p className="text-gray-300 text-lg max-w-md">
                        The secure workspace for business communication. Boost productivity with AI-powered insights.
                    </p>
                </div>
            </div>

            {/*Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0b1127] p-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout