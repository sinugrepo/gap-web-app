import { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FormData from "form-data";
import Swal from "sweetalert2";
import "./index.css";
import "./App.css";

function App() {
  const [dataGap, setDataGap] = useState([]);
  const [doc, setDoc] = useState(null);
  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDoc(file);
    }
  };

  const getStoredValue = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [intellectualWeights, setIntellectualWeights] = useState(
    getStoredValue("intellectualWeights", {
      CS: 3,
      VI: 3,
      SB: 4,
      PSR: 4,
      KN: 3,
      LP: 4,
      FB: 4,
      IK: 5,
      ANT: 3,
      IQ: 4,
    })
  );

  const [workAttitudeWeights, setWorkAttitudeWeights] = useState(
    getStoredValue("workAttitudeWeights", {
      EP: 3,
      KTJ: 4,
      KH: 2,
      PP: 3,
      DB: 3,
      VP: 5,
    })
  );

  const [behaviorWeights, setBehaviorWeights] = useState(
    getStoredValue("behaviorWeights", {
      D: 3,
      I: 3,
      S: 4,
      C: 5,
    })
  );

  const [percentages, setPercentages] = useState(
    getStoredValue("percentages", {
      coreFactor: 60,
      secondaryFactor: 40,
      intellectual: 20,
      workAttitude: 30,
      behavior: 50,
    })
  );

  const [coreFactors, setCoreFactors] = useState(
    getStoredValue("coreFactors", {
      intellectual: {
        CS: false,
        VI: false,
        SB: false,
        PSR: false,
        KN: false,
        LP: false,
        FB: false,
        IK: false,
        ANT: false,
        IQ: false,
      },
      workAttitude: {
        EP: false,
        KTJ: false,
        KH: false,
        PP: false,
        DB: false,
        VP: false,
      },
      behavior: {
        D: false,
        I: false,
        S: false,
        C: false,
      },
    })
  );

  const handleWeightChange = (category, key, value) => {
    if (category === "intellectual") {
      setIntellectualWeights({ ...intellectualWeights, [key]: value });
    } else if (category === "workAttitude") {
      setWorkAttitudeWeights({ ...workAttitudeWeights, [key]: value });
    } else if (category === "behavior") {
      setBehaviorWeights({ ...behaviorWeights, [key]: value });
    }
  };

  useEffect(() => {
    // Ambil data dari localStorage jika ada
    const storedIntellectualWeights = localStorage.getItem(
      "intellectualWeights"
    );
    const storedWorkAttitudeWeights = localStorage.getItem(
      "workAttitudeWeights"
    );
    const storedBehaviorWeights = localStorage.getItem("behaviorWeights");
    const storedPercentages = localStorage.getItem("percentages");
    const storedCoreFactors = localStorage.getItem("coreFactors");

    if (storedIntellectualWeights) {
      setIntellectualWeights(JSON.parse(storedIntellectualWeights));
    }
    if (storedWorkAttitudeWeights) {
      setWorkAttitudeWeights(JSON.parse(storedWorkAttitudeWeights));
    }
    if (storedBehaviorWeights) {
      setBehaviorWeights(JSON.parse(storedBehaviorWeights));
    }
    if (storedPercentages) {
      setPercentages(JSON.parse(storedPercentages));
    }
    if (storedCoreFactors) {
      setCoreFactors(JSON.parse(storedCoreFactors));
    }
  }, []);

  useEffect(() => {
    // Simpan data ke localStorage ketika ada perubahan
    localStorage.setItem(
      "intellectualWeights",
      JSON.stringify(intellectualWeights)
    );
    localStorage.setItem(
      "workAttitudeWeights",
      JSON.stringify(workAttitudeWeights)
    );
    localStorage.setItem("behaviorWeights", JSON.stringify(behaviorWeights));
    localStorage.setItem("percentages", JSON.stringify(percentages));
    localStorage.setItem("coreFactors", JSON.stringify(coreFactors));
  }, [
    intellectualWeights,
    workAttitudeWeights,
    behaviorWeights,
    percentages,
    coreFactors,
  ]);

  const handlePercentageChange = (key, value) => {
    setPercentages({ ...percentages, [key]: value });
  };

  const handleCheckboxChange = (category, key) => {
    setCoreFactors({
      ...coreFactors,
      [category]: {
        ...coreFactors[category],
        [key]: !coreFactors[category][key],
      },
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // doc.text("Data Karyawan", 14, 16);

    autoTable(doc, {
      head: [["ID Karyawan", "Total Hasil Akhir"]],
      body: dataGap.map((item) => [item.Id_Karyawan, item.totalHasilAkhir]),
    });

    doc.save("data_karyawan.pdf");
  };

  const kapasitasIntelektualCF = Object.keys(coreFactors.intellectual)
    .filter((key) => coreFactors.intellectual[key])
    .map((key) => ({ cf: `bobot${key}` }));

  const sikapKerjaCF = Object.keys(coreFactors.workAttitude)
    .filter((key) => coreFactors.workAttitude[key])
    .map((key) => ({ cf: `bobot${key}` }));

  const perilakuCF = Object.keys(coreFactors.behavior)
    .filter((key) => coreFactors.behavior[key])
    .map((key) => ({ cf: `bobot${key}` }));

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("file", doc);
    data.append("aspekKapasitasIntelektualCS", intellectualWeights.CS);
    data.append("aspekKapasitasIntelektualVI", intellectualWeights.VI);
    data.append("aspekKapasitasIntelektualSB", intellectualWeights.SB);
    data.append("aspekKapasitasIntelektualPSR", intellectualWeights.PSR);
    data.append("aspekKapasitasIntelektualKN", intellectualWeights.KN);
    data.append("aspekKapasitasIntelektualLP", intellectualWeights.LP);
    data.append("aspekKapasitasIntelektualFB", intellectualWeights.FB);
    data.append("aspekKapasitasIntelektualIK", intellectualWeights.IK);
    data.append("aspekKapasitasIntelektualANT", intellectualWeights.ANT);
    data.append("aspekKapasitasIntelektualIQ", intellectualWeights.IQ);
    data.append("aspekSikapKerjaEP", workAttitudeWeights.EP);
    data.append("aspekSikapKerjaKTJ", workAttitudeWeights.KTJ);
    data.append("aspekSikapKerjaKH", workAttitudeWeights.KH);
    data.append("aspekSikapKerjaPP", workAttitudeWeights.PP);
    data.append("aspekSikapKerjaDB", workAttitudeWeights.DB);
    data.append("aspekSikapKerjaVP", workAttitudeWeights.VP);
    data.append("aspekPerilakuD", behaviorWeights.D);
    data.append("aspekPerilakuI", behaviorWeights.I);
    data.append("aspekPerilakuS", behaviorWeights.S);
    data.append("aspekPerilakuC", behaviorWeights.C);
    data.append(
      "kapasitasIntelektualCF",
      JSON.stringify(kapasitasIntelektualCF, null, 2)
    );
    data.append("sikapKerjaCF", JSON.stringify(sikapKerjaCF, null, 2));
    data.append("perilakuCF", JSON.stringify(perilakuCF, null, 2));
    data.append("prosentaseCF", percentages.coreFactor);
    data.append("prosentaseSF", 100 - percentages.coreFactor);
    data.append("prosentaseKapasitasIntelektual", percentages.intellectual);
    data.append("prosentaseSikapKerja", percentages.workAttitude);
    data.append("prosentasePerilaku", percentages.behavior);

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Content-Length": data.length,
      },
      maxBodyLength: Infinity,
    };

    axios
      .post("http://localhost:3001/upload", data, config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDataGap(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          Swal.fire({
            title: "Error!",
            text: "Data Tidak Valid, Tolong Cek Kembali Input Bobot!",
            icon: "error",
            confirmButtonText: "Close",
          });
          console.log("Error Response Data:", error.response.data);
          console.log("Error Response Status:", error.response.status);
          console.log("Error Response Headers:", error.response.headers);
        } else if (error.request) {
          console.log("Error Request:", error.request);
        } else {
          console.log("Error Message:", error.message);
        }
        console.log(error.config);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID Karyawan",
        accessor: "Id_Karyawan",
      },
      {
        Header: "Total Hasil Akhir",
        accessor: "totalHasilAkhir",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: dataGap }, useSortBy);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <div className="bg-blue-200 p-4 flex justify-center items-center mb-12">
          <h1 className="text-center text-[20px]">
            <b>Sistem SPK Metode Gap Competence</b>
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Import Data Excel</h1>
          <button className="text-sm text-blue-500">
            Belum Punya Template Data?{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1GRYVaUnN3QY5ogVPs3k0gfz88d1CocA3/edit?usp=sharing&ouid=115585759759635127920&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-semibold">Download Disini</span>
            </a>
          </button>
        </div>
        <div className="border p-4 mb-6 rounded-lg">
          <input
            type="file"
            className="px-4 py-2 rounded"
            onChange={handleDocChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <h2 className="font-semibold mb-2">
              Bobot Kriteria Kapasitas Intelektual
            </h2>
            <div className="border p-4 rounded-lg">
              {Object.keys(intellectualWeights).map((key, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{key}</span>
                  <input
                    type="number"
                    value={intellectualWeights[key]}
                    onChange={(e) =>
                      handleWeightChange("intellectual", key, e.target.value)
                    }
                    className="bg-gray-300 w-12 text-center rounded"
                    min="1"
                    max="5"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Bobot Kriteria Sikap Kerja</h2>
            <div className="border p-4 rounded-lg">
              {Object.keys(workAttitudeWeights).map((key, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{key}</span>
                  <input
                    type="number"
                    value={workAttitudeWeights[key]}
                    onChange={(e) =>
                      handleWeightChange("workAttitude", key, e.target.value)
                    }
                    className="bg-gray-300 w-12 text-center rounded"
                    min="1"
                    max="5"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Bobot Kriteria Perilaku</h2>
            <div className="border p-4 rounded-lg">
              {Object.keys(behaviorWeights).map((key, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{key}</span>
                  <input
                    type="number"
                    value={behaviorWeights[key]}
                    onChange={(e) =>
                      handleWeightChange("behavior", key, e.target.value)
                    }
                    className="bg-gray-300 w-12 text-center rounded"
                    min="1"
                    max="5"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Prosentase</h2>
            <div className="border p-4 rounded-lg">
              {[
                { label: "Core Factor", key: "coreFactor" },
                { label: "Secondary Factor", key: "secondaryFactor" },
                { label: "Kapasitas Intelektual", key: "intellectual" },
                { label: "Sikap Kerja", key: "workAttitude" },
                { label: "Perilaku", key: "behavior" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{item.label}</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={percentages[item.key]}
                      onChange={(e) =>
                        handlePercentageChange(item.key, e.target.value)
                      }
                      className="bg-gray-300 w-16 text-center rounded mr-2"
                      min="1"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <h2 className="font-semibold mb-2">
              Kapasitas Intelektual Core Factor
            </h2>
            {Object.keys(coreFactors.intellectual).map((key, index) => (
              <label key={index} className="checkbox-label mb-2">
                <input
                  type="checkbox"
                  checked={coreFactors.intellectual[key]}
                  onChange={() => handleCheckboxChange("intellectual", key)}
                />
                {key} (
                {
                  {
                    CS: "Common Sense",
                    VI: "Verbalisasi Ide",
                    SB: "Sistematika Berfikir",
                    PSR: "Penalaran dan Solusi Real",
                    KN: "Konsenstrasi",
                    LP: "Logika Praktis",
                    FB: "Fleksibilitas Berfikir",
                    IK: "Imajinasi Kreatif",
                    ANT: "Imajinasi Kreatif",
                    IQ: "Potensi Kecerdasan",
                  }[key]
                }
                )
              </label>
            ))}
          </div>
          <div>
            <h2 className="font-semibold mb-2">Sikap Kerja Core Factor</h2>
            {Object.keys(coreFactors.workAttitude).map((key, index) => (
              <label key={index} className="checkbox-label mb-2">
                <input
                  type="checkbox"
                  checked={coreFactors.workAttitude[key]}
                  onChange={() => handleCheckboxChange("workAttitude", key)}
                />
                {key} (
                {
                  {
                    EP: "Energi Psikis",
                    KTJ: "Ketelitian dan Tanggung Jawab",
                    KH: "Kehati-hatian",
                    PP: "Pengendalian Perasaan",
                    DB: "Dorongan Berprestasi",
                    VP: "Vitalitas dan Perencana",
                  }[key]
                }
                )
              </label>
            ))}
          </div>
          <div>
            <h2 className="font-semibold mb-2">Perilaku Core Factor</h2>
            {Object.keys(coreFactors.behavior).map((key, index) => (
              <label key={index} className="checkbox-label mb-2">
                <input
                  type="checkbox"
                  checked={coreFactors.behavior[key]}
                  onChange={() => handleCheckboxChange("behavior", key)}
                />
                {key} (
                {
                  {
                    D: "Dominance",
                    I: "Influences",
                    S: "Steadiness",
                    C: "Compliance",
                  }[key]
                }
                )
              </label>
            ))}
          </div>
        </div>
        <button
          className="bg-blue-500 text-white w-full py-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleSubmit}
        >
          SUBMIT
        </button>
        <div className="container mx-auto mt-5">
          {/* Konten lainnya */}
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg float-right"
            onClick={exportToPDF}
          >
            Ekspor ke PDF
          </button>
          {/* Tabel dan konten lainnya */}
          <h1 className="text-2xl font-bold mb-4">Data Karyawan</h1>
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full bg-white border border-gray-300"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-gray-200"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="py-3 px-6 text-left cursor-pointer"
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="text-gray-600 text-sm">
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="py-3 px-6 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
