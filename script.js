// Deklarasi variabel di luar fungsi
const inputNIM = document.getElementById("nim");
const inputNama = document.getElementById("nama");
const inputJurusan = document.getElementById("jurusan");
const inputJudul = document.getElementById("judul");
const inputTPinjam = document.getElementById("pinjam");
const inputTBalik = document.getElementById("balik");
const tableData = document.getElementById("data-table");
//Fungsi Untuk Menambahkan data
function addData() {
  const nim = inputNIM.value;
  const nama = inputNama.value;
  const jurusan = inputJurusan.value;
  const judul = inputJudul.value;
  const pinjam = inputTPinjam.value;
  const balik = inputTBalik.value;

  // Validasi NIM (harus terdiri dari 12 karakter)
  if (nim.length !== 12) {
    alert("NIM harus terdiri dari 12 karakter!");
    return;
  }

  // Validasi Nama (hanya huruf)
  const regexNama = /^[A-Za-z\s]+$/;
  if (!regexNama.test(nama)) {
    alert("Nama hanya boleh berisi huruf!");
    return;
  }

  // Buat baris baru di tabel dan tambahkan ke tabel
  const row = document.createElement("tr");
  const value = [nim, nama, jurusan, judul, pinjam, balik];

  for (let i = 0; i < value.length; i++) {
    const cell = document.createElement("td");
    cell.innerHTML = value[i];
    row.appendChild(cell);
  }

  // Tombol Hapus
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus";
  deleteButton.onclick = function () {
    row.remove();
  };

  const deleteCell = document.createElement("td");
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  tableData.appendChild(row);

  // Simpan ke Local Storage
  const data = {
    nim,
    nama,
    jurusan,
    judul,
    pinjam,
    balik,
  };

  let storedData = JSON.parse(localStorage.getItem("mahasiswa")) || [];
  storedData.push(data);
  localStorage.setItem("mahasiswa", JSON.stringify(storedData));
}
function searchData() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("data-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let found = false;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell) {
        const textValue = cell.textContent || cell.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
document.getElementById("parallaxContainer").style.background = 'url("bg.jpg")';
//fungsi download tabel
function downloadTable() {
  const table = document.getElementById("data-table");

  // Buat tabel HTML baru untuk menyimpan data
  const newTable = document.createElement("table");
  newTable.innerHTML = table.innerHTML;

  // Buat objek Blob dari tabel HTML
  const blob = new Blob([newTable.outerHTML], {
    type: "text/html",
  });

  // Buat URL dari objek Blob
  const url = URL.createObjectURL(blob);

  // Buat link unduh
  const link = document.createElement("a");
  link.href = url;
  link.download = "data_tabel.html"; // Nama file yang akan diunduh

  // Klik link secara otomatis untuk mengunduh file
  link.click();

  // Bebaskan URL yang telah dibuat setelah pengunduhan
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

//fungsi scan barcode const barcodeDetector = new BarcodeDetector();
/*let isCameraOn = false; // Menandakan status kamera

const toggleCamera = async () => {
  const video = document.getElementById("video-preview");

  if (!isCameraOn) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.style.display = "block"; // Tampilkan video ketika kamera diaktifkan
      video.play();

      isCameraOn = true; // Update status kamera
      startBarcodeDetection(video); // Mulai deteksi barcode
    } catch (err) {
      console.error("Tidak dapat mengakses kamera: ", err);
    }
  } else {
    video.srcObject.getTracks().forEach((track) => track.stop()); // Hentikan akses kamera
    video.style.display = "none"; // Sembunyikan video ketika kamera dinonaktifkan
    isCameraOn = false; // Update status kamera
  }
};

const startBarcodeDetection = (video) => {
  const barcodeDetector = new BarcodeDetector();

  video.onloadedmetadata = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    setInterval(async () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const barcodes = await barcodeDetector.detect(canvas);
      if (barcodes.length > 0) {
        const scannedData = barcodes[0].rawValue; // Nilai dari barcode yang terbaca
        addDataFromBarcode(scannedData); // Menambahkan data dari barcode ke tabel
      }
    }, 1000); // Ambil gambar dari kamera setiap detik
  };
};

function addDataFromBarcode(scannedData) {
  const data = scannedData.split(",");

  const nimInput = document.getElementById("nim");
  const namaInput = document.getElementById("nama");

  // Ambil data untuk NIM dan Nama dari hasil scan barcode
  const nimFromBarcode = data[0]; // Misalkan NIM ada di indeks pertama
  const namaFromBarcode = data[1]; // Misalkan Nama ada di indeks kedua

  // Set nilai hasil scan ke input NIM dan Nama
  nimInput.value = nimFromBarcode;
  namaInput.value = namaFromBarcode;

  // Tambahkan data ke dalam tabel (secara manual atau dengan logika lainnya)
  const row = document.createElement("tr");

  // Tambahkan data manual untuk bagian lainnya
  const jurusanInput = document.getElementById("jurusan");
  const judulInput = document.getElementById("judul");
  const pinjamInput = document.getElementById("pinjam");
  const balikInput = document.getElementById("balik");

  const otherData = [
    jurusanInput.value,
    judulInput.value,
    pinjamInput.value,
    balikInput.value,
  ];

  // Gunakan nilai dari input manual untuk bagian lainnya
  for (const value of [nimFromBarcode, namaFromBarcode, ...otherData]) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  }

  const table = document.getElementById("data-table");
  table.appendChild(row);
}*/
const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", toggleCamera);
