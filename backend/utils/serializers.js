export const doctorPublic = (doctor) => ({
  _id: doctor._id,
  name: doctor.name,
  email: doctor.email,
  image: doctor.image,
  speciality: doctor.speciality,
  degree: doctor.degree,
  experience: doctor.experience,
  about: doctor.about,
  fees: doctor.fees,
  phone: doctor.phone,
  address: doctor.address,
  active: doctor.active,
});

export const userPublic = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  doctorId: user.doctorId,
  phone: user.phone,
  address: user.address,
  gender: user.gender,
  dob: user.dob,
});
