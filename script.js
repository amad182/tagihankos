document.addEventListener('DOMContentLoaded', function() {
    const daftarKamar = document.getElementById('daftar-kamar');
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

            const cellNomor = row.insertCell();
            cellNomor.textContent = kamar.nomor;

            const cellHarga = row.insertCell();
            cellHarga.textContent = formatRupiah(kamar.harga);

            const cellStatus = row.insertCell();
            const dropdownStatus = document.createElement('select');
            dropdownStatus.classList.add('status-dropdown');
            dropdownStatus.dataset.nomorKamar = kamar.nomor;

            const optionBelumLunas = document.createElement('option');
            optionBelumLunas.value = 'belum lunas';
            optionBelumLunas.textContent = 'Belum Lunas';
            optionBelumLunas.selected = kamar.status === 'belum lunas';

            const optionLunas = document.createElement('option');
            optionLunas.value = 'lunas';
            optionLunas.textContent = 'Lunas';
            optionLunas.selected = kamar.status === 'lunas';

            dropdownStatus.appendChild(optionBelumLunas);
            dropdownStatus.appendChild(optionLunas);

            dropdownStatus.addEventListener('change', function() {
                const nomorKamar = parseInt(this.dataset.nomorKamar);
                const statusBaru = this.value;
                ubahStatusPembayaran(nomorKamar, statusBaru);
            });

            cellStatus.appendChild(dropdownStatus);

            const cellWhatsApp = row.insertCell();
            const inputWhatsApp = document.createElement('input');
            inputWhatsApp.type = 'text';
            inputWhatsApp.classList.add('whatsapp-input');
            inputWhatsApp.value = kamar.whatsapp;
            inputWhatsApp.placeholder = 'Nomor WhatsApp';
            inputWhatsApp.dataset.nomorKamar = kamar.nomor;
            inputWhatsApp.addEventListener('change', function() {
                const nomorKamar = parseInt(this.dataset.nomorKamar);
                const nomorWhatsAppBaru = this.value;
                updateNomorWhatsApp(nomorKamar, nomorWhatsAppBaru);
            });
            cellWhatsApp.appendChild(inputWhatsApp);

            const cellAksi = row.insertCell();

            const tombolLunas = document.createElement('button');
            tombolLunas.textContent = 'Lunas';
            tombolLunas.classList.add('button-bayar');
            tombolLunas.addEventListener('click', function() {
                const nomorKamar = kamar.nomor;
                const kamarSaatIni = dataKamar.find(k => k.nomor === nomorKamar);
                if (kamarSaatIni) {
                    kirimNotifikasiLunas(nomorKamar, kamarSaatIni.whatsapp);
                } else {
                    alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
                }
            });
            cellAksi.appendChild(tombolLunas);

            const tombolTagih = document.createElement('button');
            tombolTagih.textContent = 'Tagih';
            tombolTagih.classList.add('button-tagih');
            tombolTagih.addEventListener('click', function() {
                const nomorKamar = kamar.nomor;
                const kamarSaatIni = dataKamar.find(k => k.nomor === nomorKamar);
                if (kamarSaatIni) {
                    kirimNotifikasiTagihan(nomorKamar, kamarSaatIni.whatsapp);
                } else {
                    alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
                }
            });
            cellAksi.appendChild(tombolTagih);
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
            const pesan = `Halo penghuni kamar ${kamar.nomor}, mohon segera melakukan pelunasan pembayaran kontrakan/kos sebelum tanggal 10. Terima kasih.`;
            const urlWhatsApp = `https://wa.me/${nomorWhatsApp.startsWith('+') ? '' : '+62'}${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
            console.log("URL Tagih:", urlWhatsApp);
            window.open(urlWhatsApp, '_blank');
            alert(`Notifikasi tagihan dikirim ke WhatsApp untuk kamar ${nomorKamar} ke nomor ${nomorWhatsApp}.`);
        } else if (!nomorWhatsApp) {
            alert(`Nomor WhatsApp untuk kamar ${nomorKamar} belum diisi.`);
        } else if (kamar && kamar.status === 'lunas') {
            alert(`Kamar ${nomorKamar} sudah lunas.`);
        } else {
            alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
        }
    }

    function kirimNotifikasiLunas(nomorKamar, nomorWhatsApp) {
        const kamar = dataKamar.find(kamar => kamar.nomor === nomorKamar);
        if (kamar && kamar.status === 'lunas' && nomorWhatsApp) {
            const pesan = `Terima kasih atas pembayaran kontrakan/kos untuk kamar ${kamar.nomor}. Pembayaran Anda telah kami terima.`;
            const urlWhatsApp = `https://wa.me/${nomorWhatsApp.startsWith('+') ? '' : '+62'}${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
            console.log("URL Lunas:", urlWhatsApp);
            window.open(urlWhatsApp, '_blank');
            alert(`Notifikasi konfirmasi lunas dikirim ke WhatsApp untuk kamar ${nomorKamar} ke nomor ${nomorWhatsApp}.`);
        } else if (!nomorWhatsApp) {
            alert(`Nomor WhatsApp untuk kamar ${nomorKamar} belum diisi.`);
        } else if (kamar && kamar.status === 'belum lunas') {
            alert(`Kamar ${nomorKamar} belum lunas. Pastikan status sudah diubah menjadi 'Lunas' terlebih dahulu.`);
        } else {
            alert(`Data kamar ${nomorKamar} tidak ditemukan.`);
        }
    }

    tampilkanDaftarKamar();
});