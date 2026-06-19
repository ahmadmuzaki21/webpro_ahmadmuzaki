import fotoProfil from "../../../images/1.jpg";
export const profilHTML = `
    <header>
      <img src="${fotoProfil}" alt="Foto profile" class="img-saya" />
      <h1>AHMAD MUZAKI</h1>
      <p class="paragrafprofile">
        Halo, saya Ahmad Muzaki. Saya berusia 20 tahun dan berasal dari Kroya.
        Saat ini saya sedang menempuh pendidikan di <strong>Universitas Nahdlatul Ulama</strong> 
        <em>Al Ghazali Cilacap</em>, Jurusan Informatika semester 4. Saya memiliki minat
        besar dalam bidang teknologi, terutama pada pengembangan web dan desain grafis.
      </p>
    </header>

    <main>
      <div id="content">
        <section id="tentangsaya">
          <h2>Tentang Saya</h2>
          <p>
            Saya adalah seorang mahasiswa di Universitas Nahdlatul Ulama Al 
            Ghazali Cilacap, Jurusan Informatika semester 4. Saya memiliki minat 
            besar dalam bidang teknologi, terutama pada pengembangan web dan 
            desain grafis.
          </p>
        </section>

        <section id="hobisaya">
          <h2>Hobi Saya</h2>
          <ul>
            <li>Desain</li>
            <li>Ngoding</li>
            <li>Membaca</li>
            <li>Gaming</li>
          </ul>
        </section>

        <section id="goals">
          <h2>My Top 3 Goals</h2>
          <ol>
            <li>Lulus tepat waktu</li>
            <li>Menguasai desain UI/UX dan pengembangan web</li>
            <li>Membuat portfolio</li>
          </ol>
        </section>

        <section id="favouritethings">
          <h2>Favourite Things</h2>
          <table>
            <tr>
              <th>Kategori</th>
              <th>Favorit Saya</th>
            </tr>
            <tr><td>Makanan</td><td>Mie Ayam</td></tr>
            <tr><td>Warna</td><td>Biru</td></tr>
            <tr><td>Film</td><td>Comic 8</td></tr>
            <tr><td>Buku</td><td>Nanti Kita Cerita Hari Ini</td></tr>
          </table>
        </section>

        <section id="artikel-cms">
          <h2>Artikel Terbaru</h2>
          <div id="container-artikel"><p>Memuat artikel...</p></div>
        </section>

        <section id="story-cam">
          <h2>Story Cam</h2>
          <div id="gallery-story"><p>Hasil foto Story Cam akan muncul di sini.</p></div>
        </section>

        <section id="kontaksaya">
          <div class="container-form">
            <div class="keterangan">
              <h2>Kontak Saya</h2>
              <p>Silakan isi form di bawah ini untuk menghubungi saya.</p>
            </div>
            <form>
              <div class="form-group">
                <label for="name">Nama</label>
                <input type="text" id="name" name="name" placeholder="Ahmad Muzaki" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="ahmadmuzaki@mail.com" />
              </div>
              <div class="form-group">
                <label for="phone">Nomor Telepon</label>
                <div class="input-combined">
                  <span class="flag">🇮🇩 +62</span>
                  <input type="text" id="phone" name="phone" placeholder="081234567890" />
                </div>
              </div>
              <div class="form-group">
                <label for="keperluan">Keperluan</label>
                <select id="keperluan" name="keperluan">
                  <option value="">Pilih Keperluan</option>
                  <option value="personal">Pribadi</option>
                  <option value="work">Pekerjaan</option>
                </select>
              </div>
              <div class="form-group">
                <label for="pesan">Pesan</label>
                <textarea id="pesan" name="pesan" rows="4" maxlength="500" placeholder="Tulis pesan Anda di sini..."></textarea>
              </div>
              <button type="submit" class="btn-submit">Submit</button>
            </form>
          </div>
        </section>

      <section id="map-location">
  <h2>Lokasi Saya</h2>
  <div id="map" style="height: 400px; width: 100%; border-radius: 12px;"></div>
</section>
      </div>
    </main>
`;
