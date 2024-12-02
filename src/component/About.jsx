import React from 'react';
import Navbar from './navbar';
// Dummy profile images (gunakan placeholder atau generate di https://ui-avatars.com/)
const dummyProfiles = [
  {
    name: 'Najmul Azka',
    nim: '21SA2002',
    image: `https://ui-avatars.com/api/?name=Najmul+Azka&background=0D8ABC&color=fff`
  },
  {
    name: 'Rizki Nugroho',
    nim: '21SA2080',
    image: `https://ui-avatars.com/api/?name=Rizki+Nugroho&background=5F9EA0&color=fff`
  },
  {
    name: 'Dea Lili Anggraeni',
    nim: '21SA2016',
    image: `https://ui-avatars.com/api/?name=Dea+Lili+Anggraeni&background=2E8B57&color=fff`
  },
  {
    name: 'Az Zahra Dwi Nur Adiya',
    nim: '21SA2103',
    image: `https://ui-avatars.com/api/?name=Az+Zahra+Dwi+Nur+Adiya&background=8A2BE2&color=fff`
  },
  {
    name: 'Rema Sekar Nuriani',
    nim: '21SA2074',
    image: `https://ui-avatars.com/api/?name=Rema+Sekar+Nuriani&background=FF6347&color=fff`
  },
  {
    name: 'Disi Fasa Tri Rahmawati',
    nim: '21SA2053',
    image: `https://ui-avatars.com/api/?name=Disi+Fasa+Tri+Rahmawati&background=4682B4&color=fff`
  }
];

function About() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Tim Kami
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Mahasiswa Sistem Informasi - Universitas Amikom
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dummyProfiles.map((profile, index) => (
            <div 
              key={index} 
              className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center space-x-6">
                  <img 
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-300"
                    src={profile.image} 
                    alt={profile.name}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profile.name}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                      {profile.nim}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default About;