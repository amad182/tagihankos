document.addEventListener('DOMContentLoaded', function() {
    const daftarKamar = document.getElementById('daftar-kamar');
    const modalAksi = document.getElementById('modal-aksi');
    const tombolLunasModal = document.getElementById('tombol-lunas-modal');
    const tombolTagihModal = document.getElementById('tombol-tagih-modal');
    const inputWhatsAppModal = document.getElementById('input-whatsapp-modal');
    const tombolTutupModal = document.querySelector('.close-button');
    const hargaBayarModal = document.getElementById('harga-bayar-modal'); // Elemen baru untuk menampilkan harga
    let kamarAktif = null;

    const dataKamar = [
        { nomor: 1, harga: 1200000, status: 'belum lunas', whatsapp: '' },
        { nomor: 2, harga: 1200000, status: 'lunas', whatsapp: '' },
        { nomor: 3, harga: 1200000, status: 'belum lunas', whatsapp: '' },
        { nomor: 4, harga: 1200000, status: 'lunas', whatsapp: '' },
        { nomor: 5, harga: 1200000, status: 'belum lunas', whatsapp: '' },
        { nomor: 6, harga: 1000000, status: 'lunas', whatsapp: '' },
        { nomor: 7, harga: 1000000, status: 'belum lunas', whatsapp: '' },
        { nomor: 8, harga: 1000000, status: 'lunas', whatsapp: '' },
        { nomor: 9, harga: 1000000, status: 'belum lunas', whatsapp: '' },
        { nomor: 10, harga: 1000000, status: 'lunas', whatsapp: '' }
    ];

    function tampilkanDaftarKamar() {
        daftarKamar.innerHTML = '';
        dataKamar.forEach(kamar => {
            const row = daftarKamar.insertRow();

            let cell = row.insertCell();
            cell.textContent = kamar.nomor;
            cell.setAttribute('data-label', 'Nomor Kamar');

            cell = row.insertCell();
            cell.textContent = formatRupiah(kamar.harga);
            cell.setAttribute('data-label', 'Harga per Bulan');

            cell = row.insertCell();
            const tombolBayarTabel = document.createElement('button');
            tombolBayarTabel.textContent = 'Pembayaran';
            tombolBayarTabel.classList.add('button-bayar-tabel');
            tombolBayarTabel.dataset.nomorKamar = kamar.nomor;
            tombolBayarTabel.addEventListener('click', function() {
                kamarAktif = dataKamar.find(k => k.nomor === parseInt(this.dataset.nomorKamar));
                if (kamarAktif) {
                    hargaBayarModal.textContent = `Harga Bayar: ${formatRupiah(kamarAktif.harga)}`;
                    inputWhatsAppModal.value = kamarAktif.whatsapp;
                    modalAksi.style.display = "block";
                }
            });
            cell.appendChild(tombolBayarTabel);
            cell.setAttribute('data-label', 'Status');
        });
    }

    function formatRupiah(angka) {
        const format = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return format.format(angka);
    }

    function ubahStatusPembayaran(nomorKamar, statusBaru) {
        const kamarYangDiubah = dataKamar.find(kamar => kamar.nomor === nomorKamar);
        if (kamarYangDiubah) {
            kamarYangDiubah.status = statusBaru;
            tampilkanDaftarKamar();
        }
    }

    function updateNomorWhatsApp(nomorKamar, nomorWhatsAppBaru) {
        const kamarYangDiubah = dataKamar.find(kamar => kamar.nomor === nomorKamar);
        if (kamarYangDiubah) {
            kamarYangDiubah.whatsapp = nomorWhatsAppBaru;
        }
    }

    function kirimNotifikasiTagihan(nomorKamar, nomorWhatsApp) {
        const kamar = dataKamar.find(kamar => kamar.nomor === nomorKamar);
        if (kamar && kamar.status === 'belum lunas' && nomorWhatsApp) {
            const pesan = `Halo penghuni kamar ${kamar.nomor}, mohon segera melakukan pelunasan pembayaran kontrakan/kos sebesar ${formatRupiah(kamar.harga)} sebelum tanggal 10. Terima kasih.`;
            const urlWhatsApp = `https://wa.me/${nomorWhatsApp.startsWith('+') ? '' : '+62'}${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
            console.log("URL Tagih:", urlWhatsApp);
            window.open(urlWhatsApp, '_blank');
            alert(`Notifikasi tagihan dikirim ke WhatsApp untuk kamar ${nomorKamar} ke nomor ${nomorWhatsApp}.`);
        } else if (!nomorWhatsApp) {
            alert(`Nomor WhatsApp belum diisi.`);
        } else if (kamar && kamar.status === 'lunas') {
            alert(`Kamar ${nomorKamar} sudah lunas.`);
        } else {
            alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
        }
    }

    function kirimNotifikasiLunas(nomorKamar, nomorWhatsApp) {
        const kamar = dataKamar.find(kamar => kamar.nomor === nomorKamar);
        if (kamar && kamar.status === 'lunas' && nomorWhatsApp) {
            const pesan = `Terima kasih atas pembayaran kontrakan/kos untuk kamar ${kamar.nomor} sebesar ${formatRupiah(kamar.harga)}. Pembayaran Anda telah kami terima.`;
            const urlWhatsApp = `https://wa.me/${nomorWhatsApp.startsWith('+') ? '' : '+62'}${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
            console.log("URL Lunas:", urlWhatsApp);
            window.open(urlWhatsApp, '_blank');
            alert(`Notifikasi konfirmasi lunas dikirim ke WhatsApp untuk kamar ${nomorKamar} ke nomor ${nomorWhatsApp}.`);
        } else if (!nomorWhatsApp) {
            alert(`Nomor WhatsApp belum diisi.`);
        } else if (kamar && kamar.status === 'belum lunas') {
            alert(`Kamar ${nomorKamar} belum lunas. Pastikan status sudah diubah menjadi 'Lunas' terlebih dahulu.`);
        } else {
            alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
        }
    }

    tombolLunasModal.addEventListener('click', function() {
        if (kamarAktif) {
            ubahStatusPembayaran(kamarAktif.nomor, 'lunas');
            kamarAktif.whatsapp = inputWhatsAppModal.value;
            kirimNotifikasiLunas(kamarAktif.nomor, kamarAktif.whatsapp);
            modalAksi.style.display = "none";
        }
    });

    tombolTagihModal.addEventListener('click', function() {
        if (kamarAktif) {
            kamarAktif.whatsapp = inputWhatsAppModal.value;
            kirimNotifikasiTagihan(kamarAktif.nomor, kamarAktif.whatsapp);
            modalAksi.style.display = "none";
        }
    });

    tombolTutupModal.addEventListener('click', function() {
        modalAksi.style.display = "none";
        kamarAktif = null;
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalAksi) {
            modalAksi.style.display = "none";
            kamarAktif = null;
        }
    });

    tampilkanDaftarKamar();
});
