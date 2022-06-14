const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player');
const title = $('.header-title');
const singer = $('.header-singer');
const cdThumb = $('.cd-thumb');
const playList = $('.playlist');
const playSong = $('.playlist-song');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const playBtn = $('.btn-toggle-play');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const audio = $('#audio');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [{
            id: '1',
            name: 'Butter',
            singer: 'BTS',
            path: './assest/music/Butter.mp3',
            image: './assest/img/butter-cover.jpg'
        },
        {
            id: '2',
            name: 'Dynamite',
            singer: 'BTS',
            path: './assest/music/Dynamite.mp3',
            image: './assest/img/Dynamite.jpg'
        },
        {
            id: '3',
            name: 'Permission To Dance',
            singer: 'BTS',
            path: './assest/music/Permission to Dance.mp3',
            image: './assest/img/Permission_to_Dance.jpg'
        },
        {
            id: '4',
            name: 'Play Date',
            singer: 'Melanie Martinez',
            path: './assest/music/Play Date.mp3',
            image: './assest/img/playdate.jpg'
        },
        {
            id: '5',
            name: `OMG What's Happening`,
            singer: 'Ava Max',
            path: './assest/music/OMG Whats Happening.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Ava_Max_-_OMG_What%27s_Happening.png'
        },
        {
            id: '6',
            name: 'Sweet but Psycho',
            singer: 'Ava Max',
            path: './assest/music/Sweet but Psycho.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/9/96/Ava_Max_%E2%80%93_Sweet_but_Psycho.png'
        },
        {
            id: '7',
            name: 'Eurphoria',
            singer: 'Jungkook (BTS)',
            path: './assest/music/Euphoria.mp3',
            image: './assest/img/love_yourself.jpg'
        },
        {
            id: '8',
            name: 'Still With You',
            singer: 'Jungkook (BTS)',
            path: './assest/music/Still With You.mp3',
            image: 'https://btstv.files.wordpress.com/2020/06/artworks-7nmc0l048kdmtv7q-asok7a-t500x500.jpg'
        },
        {
            id: '9',
            name: 'Shivers',
            singer: 'Ed Sheeran (feat. Jessi & SUNMI)',
            path: './assest/music/Shivers.mp3',
            image: './assest/img/shivers.jpg'
        },
        {
            id: '10',
            name: 'Hero',
            singer: 'Cash Cash (feat. Christina Perri)',
            path: './assest/music/Hero.mp3',
            image: 'https://www.cevirce.com/en/translate/wp-content/uploads/2021/05/cash-cash-feat.-christina-perri-hero-lyrics.jpg'
        },
        {
            id: '11',
            name: 'Epiphany ',
            singer: 'Jin (BTS)',
            path: './assest/music/Epiphany.mp3',
            image: './assest/img/love_yourself.jpg'
        },

    ],
    render: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="playlist-song ${index === this.currentIndex ? 'active' : ''}" data-index= ${index}>
                <h2 class="playlist-number">${song.id}.</h2>
                <img class="playlist-img" src="${song.image}" alt="">
                <div class="playlist-body">
                    <h3 class="playlist-title">${song.name}</h3>
                    <p class="playlist-singer">${song.singer}</p>
                </div>
                <div class="playlist-option">
                    <i class="fa-solid fa-ellipsis"></i>
                    <div class="playlist-option-item">
                        <i class="icon-option fa-solid fa-download"></i>
                        Tải xuống
                    </div>
                </div>
            </div>
            `;
        })
        playList.innerHTML = html.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        // Xử lý phóng to / thu nhỏ CD khi scroll playlist
        const cdMusic = $('.cd-inner');
        const CdWidth = cdMusic.offsetWidth;
        const controls = $('.controls');

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = CdWidth - scrollTop;

            cdMusic.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cdMusic.style.opacity = newCdWidth / CdWidth;
            if (newCdWidth < 0) {
                controls.style.marginTop = 0;
                controls.style.transition = 'all 0.3s';
            } else {
                controls.style.marginTop = '20px';
                controls.style.transition = 'none';
            }
        }

        // Xử lý CD khi quay / dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(0)',
            transform: 'rotate(360deg)'
        }], {
            duration: 10000, // thời gian quay CD
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý khi click play bài hát
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Xử lý audio phát theo thời gian bài hát
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            if (app.isPlaying) {
                progress.value = progressPercent;
            } else {
                progress.value.onchange = 0;
            }
            // Tải dữ liệu
            audio.onloadeddata = function () {
                // Cập nhật tổng thời gian của bài hát
                const musicDuration = $('.duration');
                const audioDuration = audio.duration;
                const totalMin = Math.floor(audioDuration / 60);
                let totalSec = Math.floor(audioDuration % 60);
                // Thêm 0 nếu nhỏ hơn 10 giây
                if (totalSec < 10) {
                    totalSec = `0${totalSec}`;
                }
                musicDuration.innerText = `${totalMin}:${totalSec}`;
            }
            // Cập nhật thời gian nhạc hiện tại khi phát
            const musicCurrentTime = $('.current');
            const audioCurentTime = audio.currentTime;
            const currentMin = Math.floor(audioCurentTime / 60);
            let currentSec = Math.floor(audioCurentTime % 60);
            // Thêm 0 nếu nhỏ hơn 10 giây
            if (currentSec < 10) {
                currentSec = `0${currentSec}`;
            }
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
        }
        // Khi song được play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
            cdMusic.classList.add('active');
            // Xử lý bug thanh range luôn ở vị trí = 0 khi chuyển bài
            progress.value = 0;
        }
        // Khi song bị pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
            cdMusic.classList.remove('active');
        }

        // Xử lý khi tua audio 
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Xử lý khi nhấn next bài hát
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playrandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // Xử lý khi nhấn prev bài hát
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playrandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Xử lý khi nhấn nút random bài hát
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // Xử lý khi nhấn nút repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // Xử lý khi audio kết thúc
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý khi nhấn song
        playList.onclick = function (e) {
            const songNode = e.target.closest('.playlist-song:not(.active)');
            const optionNode = e.target.closest('.playlist-option');
            if (songNode || optionNode) {
                // Xử lý khi click vào song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.render();
                    app.loadCurrentSong();
                    audio.play();
                }
                // Xử lý khi click vào option song
                if (optionNode) {
                    optionNode.classList.toggle('active');
                }
            }
        }
    },
    // Hàm tự động scroll khi chuyển song
    scrollToActiveSong: function () {
        setTimeout(function () {
            if (app.currentIndex <= 2) {
                $('.playlist-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                })
            } else {
                $('.playlist-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }
        }, 300);
    },
    // Tải dữ liệu song
    loadCurrentSong: function () {
        title.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        // Chuyển hết bài thì trở về bài đầu tiên
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playrandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Định nghĩa các thuộc tính của Object
        this.defineProperties();

        // Lắng nghe xử lý các sự kiện
        this.handleEvents();

        // Tải dữ liệu nhạc
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }

}
app.start();