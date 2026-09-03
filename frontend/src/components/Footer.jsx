import { assets } from "../assets/assets_frontend/assets"

function Footer() {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left section */}
        <div>
            <img className="mb-5 w-40" src={assets.MainLogo} alt="" />
            <p className="w-full md:w-1/2 text-gray-600 leading-6">MedQuora is a modern healthcare management platform designed to make healthcare simpler, smarter, and more accessible. With an intuitive system for doctors and patients, MedQuora helps streamline patient care, appointments, medical records, and everyday healthcare management.</p>
        </div>

        {/* center section */}
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* right section */}
        <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>+8801XXXXXXXXX</li>
                <li>medquora.official@gmail.com</li>
            </ul>
        </div>
      </div>
      {/* Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2026@ MedQuora - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer