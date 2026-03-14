const AMIL_SAHEB = "Janab Aamil Saheb Shk. Mufaddal Bhai Samiwala"
const BHABHI_SAHEB = "Bhabhisaheb Nafisa Samiwala"

const boardOfDirectors = {
  name: "Board of Directors",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: "Saifuddin Bhai Suterwala", role: "Secretary" },
    { name: "Murtuza Bhai Chhatriwala", role: "Treasurer" },
    { name: "Shk Qutbuddin Bhai Doctor", role: "Director" },
    { name: "Mulla Juzer Bhai Fatehi", role: "Director" },
  ],
}

const advisoryCommittee = {
  name: "Advisory Committee",
  members: [
    { name: "Abdullah Bhai Badani", role: "Advisor" },
    { name: "Tayyeb Bhai Baxamusa", role: "Advisor" },
    { name: "Dr. Burhanuddin Bhai Mohammedali", role: "Advisor" },
    { name: "Quaidzoher Bhai Dhilla", role: "Advisor" },
    { name: "Mulla Aliasghar Bhai Darugar", role: "Advisor" },
  ],
}

const madrasah = {
  name: "Madrasah Jamaliyah",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: "Umaima Bhen Darugar", role: "Head Teacher" },
    { name: "Shk Qutbuddin Bhai Doctor", role: "Teacher" },
    { name: "Fatema Bhen Doctor", role: "Teacher" },
    { name: "Fatema Bhen Baxamusa", role: "Teacher" },
    { name: "Munira Bhen Suterwala", role: "Teacher" },
    { name: "Rashida Bhen Zakir", role: "Teacher" },
    { name: "Munira Bhen Darugar", role: "Teacher" },
    { name: "Mulla Aliasghar Bhai Darugar", role: "Secretary" },
    { name: "Mustafa Bhai Lukmani", role: "Joint Secretary" },
    { name: "Murtuza Bhai Chhatriwala", role: "Treasurer" },
    { name: "Mohammed Bhai Kurawadwala", role: "Member" },
    { name: "Mulla Adnan Bhai Ghadiali", role: "Member" },
  ],
}

const shabab = {
  name: "Shabab-ul-Eidiz-Zahabi",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: "Mulla Adnan Bhai Ghadiali", role: "Secretary" },
    { name: "Saifuddin Bhai Suterwala", role: "Joint Secretary" },
  ],
}

const bwa = {
  name: "Burhani Women's Association",
  members: [
    { name: BHABHI_SAHEB, role: "President" },
    { name: "Umaima Bhen Darugar", role: "Secretary" },
    { name: "Amena Bhen Dhilla", role: "Treasurer" },
    { name: "Alefiyah Bhen Chhatriwala", role: "Joint Treasurer" },
  ],
}

const fmb = {
  name: "Faiz-ul-Mawaid il-Burhaniyah",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: "Shk Qutbuddin Bhai Doctor", role: "Secretary (office Bearer)" },
    { name: "Murtuza Bhai Chhatriwala", role: "Finance (office Bearer)" },
    { name: "Qasim Bhai Lokhandwala", role: "Jt. Finance (office Bearer)" },
    { name: "Mulla Aliasghar Bhai Darugar", role: "Procurement (office Bearer)" },
    { name: "Shk Qutbuddin Bhai Doctor", role: "Operation (office Bearer)" },
    { name: "Fatema Bhen Doctor", role: "Dana Committee Coordinator" },
    { name: "Mustafa Bhai Zakir", role: "Member" },
    { name: BHABHI_SAHEB, role: "Member" },
    { name: "Munira Bhen Suterwala", role: "Faiz Support Team Coordinator" },
    { name: "Umema Bhen Darugar", role: "Faiz Support Team Coordinator" },
    { name: "Amena Bhen Dhilla", role: "Faiz Support Team Coordinator" },
    { name: "Durriya Bhen Fatehi", role: "Member" },
  ],
}

const tnc = {
  name: "Taiseer-un-Nikah",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: BHABHI_SAHEB, role: "Head of Matchmaking" },
    { name: "Mulla Juzer Bhai Fatehi", role: "Secretary" },
    { name: "Kutbuddin Bhai Kaliyakuwawala", role: "Treasurer" },
    { name: "Dr. Burhanuddin Bhai Mohammedali", role: "Member" },
    { name: "Qasim Bhai Lokhandwala", role: "IT" },
    { name: "Zulfiqar bhai Mohamedshah", role: "Counselor Coordinator" },
    { name: "Dr. Ammar Mandviwala", role: "Teen Counselor" },
    { name: "Mulla Adnan Bhai Ghadiali", role: "Counselor" },
    { name: "Fatema Bhen Baxamusa", role: "Counselor" },
    { name: "Rehana Bhen Patanwala", role: "Counselor" },
    { name: "Mustafa Bhai Maloo", role: "Counselor" },
    { name: "Amenah Bhen Maloo", role: "Counselor" },
    { name: "Khadijah Bhen Mohamedshah", role: "Counselor" },
  ],
}

const qardan = {
  name: "Burhani Qardan Hasana",
  members: [
    { name: AMIL_SAHEB, role: "President" },
    { name: "Quaidzoher Bhai Dhilla", role: "Secretary" },
    { name: "Dr Mufaddal Bhai Dahodwala", role: "Treasurer" },
    { name: "Mustafa Bhai Lukmani", role: "Member" },
    { name: "Dr. Burhanuddin Bhai Mohammedali", role: "Member" },
    { name: "Mustafa Bhai Zakir", role: "Member" },
  ],
}

const website = {
  name: "Website",
  members: [
    { name: "Ibrahim Bhai Darugar", role: "Webmaster & Developer" },
  ],
}

export const committees = [
  boardOfDirectors,
  advisoryCommittee,
  madrasah,
  shabab,
  bwa,
  fmb,
  tnc,
  qardan,
  website,
]
