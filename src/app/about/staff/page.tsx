import StaffPage from '@/screen/about/staff'
import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
  title: "Staff Directory — LAEF",
  description: "Meet the staff and management team leading Larsen Advocacy and Empowerment Foundation.",
  openGraph: {
    title: "Staff Directory — LAEF",
    description: "The leadership and programme team behind LAEF.",
  },
};

const page = () => {
  return (
    <div>
        <StaffPage/>
    </div>
  )
}

export default page