const AMIL_SAHEB = "Janab Aamil Saheb Shk. Khuzaima Bhai Yamani"
const BHABHI_SAHEB = "Bhabhisaheb Rasheeda Yamani"

const boardOfDirectors = {
  name: "Board of Directors",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Saifuddin Bhai Suterwala",
      role: "Secretary",
    },
    {
      name: "Murtuza Bhai Chhatriwala",
      role: "Treasurer",
    },

    {
      name: "Mulla Aliasgar Bhai Presswala",
      role: "Director",
    },
    {
      name: "Mulla Juzer Bhai Fatehi",
      role: "Director",
    },
    {
      name: "Mulla Qutbuddin Bhai Doctor",
      role: "Director",
    },
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
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Mulla Aliasghar Bhai Darugar",
      role: "Secretary",
    },
    {
      name: "Mustafa Bhai Lukmani",
      role: "Joint Secretary",
    },
    {
      name: "Murtuza Bhai Chhatriwala",
      role: "Treasurer",
    },
    {
      name: "Mohammed Bhai Kurawadwala",
      role: "Member",
    },
    {
      name: "Mulla Adnan Bhai Ghadiali",
      role: "Member",
    },
    {
      name: "Umaima Bhen Darugar",
      role: "Head Teacher",
    },
    {
      name: "Mulla Qutbuddin Bhai Doctor",
      role: "Teacher",
    },
    {
      name: "Fatema Bhen Doctor",
      role: "Teacher",
    },
    {
      name: "Aarefa Bhen Taquee",
      role: "Teacher",
    },
    {
      name: "Munira Bhen Suterwala",
      role: "Teacher",
    },
    {
      name: "Rashida Bhen Zakir",
      role: "Teacher",
    },
    {
      name: "Munira Bhen Darugar",
      role: "Teacher",
    },
  ],
}

const shabab = {
  name: "Shabab-ul-Eidiz-Zahabi",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Mulla Adnan Bhai Ghadiali",
      role: " Secretary",
    },
    {
      name: "Saifuddin Bhai Suterwala",
      role: "Joint Secretary",
    },
    {
      name: "Mulla Aliasgar Bhai Presswala",
      role: "Treasurer",
    },
  ],
}

const bwa = {
  name: "Burhani Women's Association",
  members: [
    {
      name: BHABHI_SAHEB,
      role: "President",
    },
    {
      name: "Fatema Bhen Doctor",
      role: "Secretary",
    },
    {
      name: "Munira Bhen Suterwala",
      role: "Treasurer",
    },
  ],
}

const fmb = {
  name: "Faiz-ul-Mawaid il-Burhaniyah",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Mulla Aliasgar Bhai Presswala",
      role: "Secretary",
    },
    {
      name: "Zahra Bhen Presswala",
      role: "Menu Planner",
    },
    {
      name: "Murtuza Bhai Chhatriwala",
      role: "Treasurer",
    },
  ],
}

const tadfeen = {
  name: "Tadfeen",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Mulla Moiz Bhai Ghadiali",
      role: "Member",
    },
    {
      name: "Husain Bhai Rangwala",
      role: "Member",
    },
  ],
}

const tnc = {
  name: "Taiseer-un-Nikah",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: BHABHI_SAHEB,
      role: "Head of Matchmaking",
    },
    {
      name: "Mulla Adnan Bhai Ghadiali",
      role: "Secretary",
    },
    {
      name: "Kutbuddin Bhai Kaliyakuwawala",
      role: "Treasurer",
    },
    {
      name: "Mulla Juzer Bhai Fatehi",
      role: "Member",
    },
    {
      name: "Tayyeb Bhai Baxamusa",
      role: "IT",
    },
    {
      name: "Zahra Bhen Presswala",
      role: "Counselor Coordinator",
    },
    {
      name: "Tasneem Bhen Lukmani",
      role: "Counselor",
    },
    {
      name: "Fatema Bhen Baxamusa",
      role: "Counselor",
    },
  ],
}

const qardan = {
  name: "Burhani Qardan Hasana",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Shk. Aliasgar Bhai Taquee",
      role: "Secretary",
    },

    {
      name: "Mustafa Bhai Lukmani",
      role: "Treasurer",
    },
    {
      name: "Mulla Qutbuddin Bhai Doctor",
      role: "Member",
    },
    { name: "Dr. Burhanuddin Bhai Mohammedali", role: "Member" },
    {
      name: "Tayyeb Bhai Baxamusa",
      role: "Member",
    },
    {
      name: "Quaidzoher Bhai Dhilla",
      role: "Member",
    },
  ],
}

const website = {
  name: "Website",
  members: [
    {
      name: "Ibrahim Bhai Darugar",
      role: "Webmaster & Developer",
    },
  ],
}

const committees = [
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

exports.committees = committees
