const AMIL_SAHEB = "Amil Saheb Shk. Khuzaima Yamani"
const BHABHI_SAHEB = "Bhabi Saheb Rasheeda Yemani"

const boardOfDirectors = {
  name: "Board of Directors",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },

    {
      name: "Mulla Saifuddin Suterwala",
      role: "Secretary & Director",
    },
    {
      name: "Murtuza Chhatriwala",
      role: "Treasurer & Director",
    },

    {
      name: "Mulla Aliasghar Presswala",
      role: "Director",
    },
    {
      name: "Mulla Juzer Fatehi",
      role: "Director",
    },
    {
      name: "Mulla Qutbuddin Doctor",
      role: "Director",
    },

    { name: "Mulla Aliasghar Darugar", role: "Advisor", visible: false },
    { name: "Abdullah Badani", role: "Advisor", visible: false },
    { name: "Burhanuddin Hayderi", role: "Advisor", visible: false },
    { name: "Quaidzoher Dhilla", role: "Advisor", visible: false },
    { name: "Tayyeb Baxamusa", role: "Advisor", visible: false },
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
      name: "Mulla Aliasghar Darugar",
      role: "Secretary",
    },
    {
      name: "Mustafa Lukmani",
      role: "Joint Secretary",
    },
    {
      name: "Murtuza Chhatriwala",
      role: "Treasurer",
    },
    {
      name: "Mohammed Kurawadwala",
      role: "Member",
    },
    {
      name: "Mulla Adnan Ghadiali",
      role: "Member",
    },
    {
      name: "Umaima Darugar",
      role: "Head Teacher",
    },
    {
      name: "Mulla Qutbuddin Doctor",
      role: "Teacher",
    },
    {
      name: "Fatema Doctor",
      role: "Teacher",
    },
    {
      name: "Aarefa Taquee",
      role: "Teacher",
    },
    {
      name: "Munira Suterwala",
      role: "Teacher",
    },
    {
      name: "Rashida Zakir",
      role: "Teacher",
    },
    {
      name: "Munira Darugar",
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
      name: "Mulla Adnan Ghadiali",
      role: " Secretary",
    },
    {
      name: "Mulla Saifuddin Suterwala",
      role: "Joint Secretary",
    },
    {
      name: "Mulla Aliasgar Presswala",
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
      name: "Fatema Doctor",
      role: "Secretary",
    },
    {
      name: "Munira Suterwala",
      role: "Treasurer",
    },
  ],
}

const fmb = {
  name: "Faiz-ul-Mawaid",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Mulla Aliasgar Presswala",
      role: "Secretary",
    },
    {
      name: "Zahra Presswala",
      role: "Menu Planner",
    },
    {
      name: "Murtuza Chhatriwala",
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
      name: "Mulla Moiz Ghadiali",
      role: "Member",
    },
    {
      name: "Husain Rangwala",
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
      name: "Tayyeb Baxamusa",
      role: "Secretary",
    },
    {
      name: "Sabera Badani",
      role: "Counselor",
    },
    {
      name: "Quaidzoher Dhilla",
      role: "Administrator",
    },
    {
      name: "Murtuza Chhatriwala",
      role: "Treasurer & IT",
    },
  ],
}

const qardan = {
  name: "Qardan Hasana",
  members: [
    {
      name: AMIL_SAHEB,
      role: "President",
    },
    {
      name: "Tayyeb Baxamusa",
      role: "Secretary",
    },
    {
      name: "Mustafa Lukmani",
      role: "Treasurer",
    },
    {
      name: "Shk. Aliasgar Taquee",
      role: "Member",
    },
    {
      name: "Quaidzoher Dhilla",
      role: "Member",
    },
  ],
}

const website = {
  name: "Website",
  members: [
    {
      name: "Ibrahim Darugar",
      role: "Webmaster & Developer",
    },
  ],
}

const committees = [
  boardOfDirectors,
  madrasah,
  shabab,
  bwa,
  fmb,
  tadfeen,
  tnc,
  qardan,
  website,
]

exports.committees = committees
