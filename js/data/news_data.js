const NEWS_DATA = [
    {
        id: 'news01',
        title: 'ZOOTOPIA 2 chính thức trở lại sau 9 năm chờ đợi!',
        date: '25/11/2025',
        thumbnail: '/assets/images/news/zootopia_1.png', // Ảnh đại diện danh sách
        intro: 'Sau gần một thập kỷ kể từ thành công vang dội của phần đầu, Zootopia 2 đã được Disney xác nhận ra rạp.',
        images: [
            {
                src: '/assets/images/news/zootopia_1.png',
                caption: 'Bộ phim Zootopia 2'
            }
        ],
        paragraphs: [
            'Sau gần một thập kỷ kể từ thành công vang dội của phần đầu, Zootopia 2 đã được Disney xác nhận ra rạp vào ngày 28/11/2025. Bộ đôi biểu tượng Nick Wilde & Judy Hopps sẽ tái xuất trong một câu chuyện hoàn toàn mới, hứa hẹn mở rộng thế giới động vật đầy màu sắc, hài hước nhưng không kém phần sâu sắc về xã hội hiện đại.',
            'Với đồ họa được nâng cấp, kịch bản được đầu tư kỹ lưỡng và sự trở lại của dàn nhân vật được yêu thích toàn cầu, Zootopia 2 được kỳ vọng sẽ là bom tấn hoạt hình không thể bỏ lỡ dịp cuối năm 2025.',
            '🎬 Đặt vé sớm và cập nhật lịch chiếu Zootopia 2 nhanh nhất tại COP!'
        ],
        relatedNews: [
            { id: 'news02', title: 'CINETOUR “TAY ANH GIỮ MỘT VÌ SAO” tại COP Cinema' },
            { id: 'news03', title: 'HOẠT ĐỘNG GIÁO DỤC - TRẢI NGHIỆM CỦA HỌC SINH KHỐI 10 TRƯỜNG THPT LÂM NGHIỆP' }
        ]
    },
    {
        id: 'news02',
        title: 'CINETOUR “TAY ANH GIỮ MỘT VÌ SAO” tại COP Cinema ngày 10/10/2025',
        date: '10/10/2025',
        thumbnail: '/assets/images/news/tayanhgiu_1.jpg', // Ảnh đại diện danh sách
        intro: '🎬💫 CINETOUR “TAY ANH GIỮ MỘT VÌ SAO” đổ bộ COP Cinema!',
        images: [
            {
                src: '/assets/images/news/tayanhgiu_1.jpg',
                caption: 'Lee Kwang Soo – hoàng tử châu Á giao lưu cùng toàn rạp'
            },
            {
                src: '/assets/images/news/tayanhgiu_2.jpg',
                caption: 'Lee Kwang Soo - Hoàng Hà chụp ảnh giao lưu cùng fan Việt'
            },
            {
                src: '/assets/images/news/tayanhgiu_3.jpg',
                caption: 'Sự cuồng nhiệt của phòng chiếu COP Cinema dành cho Lee Kwang Soo'
            },
        ],
        paragraphs: [
            'COP Cinema vừa có một buổi tối ngập tràn cảm xúc với sự kiện CINETOUR “Tay Anh Giữ Một Vì Sao”. Sự xuất hiện của Lee Kwang Soo – “hoàng tử châu Á”, nàng thơ Hoàng Hà cùng dàn diễn viên đã thực sự khiến khán giả “đứng ngồi không yên” ngay từ những phút đầu tiên 😍',
            'Buổi giao lưu diễn ra trong không khí ấm áp – gần gũi – tràn ngập tiếng cười. Không chỉ chia sẻ về quá trình làm phim, các diễn viên còn mang đến nguồn năng lượng tích cực, sự thân thiện và những khoảnh khắc tương tác cực dễ thương khiến cả rạp không ngừng vỗ tay. Rất nhiều khán giả đã phải thừa nhận: “Xem giao lưu mà còn thấy ‘dính’ hơn cả xem phim!” 💖',
            'Từ những câu chuyện hậu trường thú vị đến những khoảnh khắc cười ra nước mắt, CINETOUR tại COP Cinema đã để lại thật nhiều kỷ niệm đáng nhớ cho người hâm mộ. Chính sự chân thành và đáng yêu của toàn bộ ê-kíp đã khiến khán giả hoàn toàn “đổ gục”.'
        ],
        relatedNews: [
            { id: 'news03', title: 'HOẠT ĐỘNG GIÁO DỤC - TRẢI NGHIỆM CỦA HỌC SINH KHỐI 10 TRƯỜNG THPT LÂM NGHIỆP' },
            { id: 'news04', title: 'Buổi ra mắt và họp báo bộ phim “Tử Chiến Trên Không”' }
        ]
    },

    {
        id: 'news03',
        title: '🎓🎬 HOẠT ĐỘNG GIÁO DỤC - TRẢI NGHIỆM CỦA HỌC SINH KHỐI 10 TRƯỜNG THPT LÂM NGHIỆP CÙNG BỘ PHIM “MƯA ĐỎ” TẠI COP CINEMA',
        date: '29/09/2025',
        thumbnail: '/assets/images/news/hoatdonggiaoduc_1.jpg', // Ảnh đại diện danh sách
        intro: 'Ngày 27/9/2025, gần 700 học sinh khối 10, cùng Ban Giám hiệu, thầy cô giáo, cán bộ nhân viên và đại diện phụ huynh Trường THPT Lâm Nghiệp đã tham gia một hoạt động giáo dục – trải nghiệm đầy ý nghĩa tại COP Cinema.',
        images: [
            {
                src: '/assets/images/news/hoatdonggiaoduc_1.jpg',
                caption: 'Toàn thể thầy cô, phụ huynh và học sinh cùng nhau cất vang Quốc ca dưới Lá cờ Tổ quốc'
            },
            {
                src: '/assets/images/news/hoatdonggiaoduc_2.jpg',
                caption: 'Các em học sinh Trường THPT Lâm Nghiệp'
            },
            {
                src: '/assets/images/news/hoatdonggiaoduc_3.jpg',
                caption: 'Các em học sinh tham quan triển lãm về lịch sử điện ảnh Việt Nam tại COP Cinema'
            },
        ],
        paragraphs: [
            'Mở đầu chương trình là khoảnh khắc trang nghiêm và xúc động khi toàn thể thầy cô, phụ huynh và học sinh cùng nhau cất vang Quốc ca dưới Lá cờ Tổ quốc, tạo nên bầu không khí thiêng liêng, khơi dậy niềm tự hào dân tộc và tinh thần trách nhiệm của thế hệ trẻ.',
            'Tiếp nối chương trình, các em học sinh đã được thưởng thức bộ phim “Mưa Đỏ” – một bản hùng ca bi tráng tái hiện 81 ngày đêm lịch sử tại Thành cổ Quảng Trị. Bộ phim mang đến những phút giây lắng đọng, xúc động, giúp các em hiểu sâu sắc hơn về sự hy sinh anh dũng của thế hệ cha anh trong công cuộc đấu tranh giành độc lập, tự do cho Tổ quốc.',
            'Hoạt động trải nghiệm tại COP Cinema không chỉ là một buổi xem phim, mà còn là một bài học lịch sử sống động, góp phần bồi dưỡng lòng biết ơn, tinh thần yêu nước và ý thức trách nhiệm công dân trong mỗi học sinh.'
        ],
        relatedNews: [
            { id: 'news04', title: 'Buổi ra mắt và họp báo bộ phim “Tử Chiến Trên Không”' },
            { id: 'news05', title: 'MƯA ĐỎ” CÙNG CÁC BÁC CỰU CHIẾN BINH CHIẾN TRƯỜNG QUẢNG TRỊ TẠI COP CINEMA' }
        ]
    },

    {
        id: 'news04',
        title: '🎬✨ Buổi ra mắt và họp báo bộ phim “Tử Chiến Trên Không” tại COP Cinema',
        date: '24/09/2025',
        thumbnail: '/assets/images/news/tuchientrenkhong_4.jpg', // Ảnh đại diện danh sách
        intro: 'Buổi ra mắt và họp báo bộ phim “Tử Chiến Trên Không” đã chính thức diễn ra tại COP Cinema trong bầu không khí trang trọng, sôi nổi và đầy cảm xúc. Sự kiện thu hút sự quan tâm của đông đảo khán giả, giới truyền thông và những người yêu điện ảnh.',
        images: [
            {
                src: '/assets/images/news/tuchientrenkhong_1.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/tuchientrenkhong_2.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/tuchientrenkhong_3.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/tuchientrenkhong_5.jpg',
                caption: ''
            }
        ],
        paragraphs: [
            'Không chỉ mang đến cơ hội thưởng thức những thước phim kịch tính, nghẹt thở, buổi họp báo còn là dịp để khán giả gặp gỡ và giao lưu trực tiếp với dàn diễn viên tài năng cùng ê-kíp làm phim. Những chia sẻ chân thành xoay quanh quá trình sản xuất, các câu chuyện hậu trường thú vị đã giúp người xem hiểu rõ hơn về tâm huyết và nỗ lực phía sau mỗi khung hình.',
            'Sự kiện tại COP Cinema đã mang đến một trải nghiệm điện ảnh trọn vẹn, góp phần lan tỏa cảm xúc và để lại ấn tượng sâu đậm trong lòng khán giả ngay từ những ngày đầu bộ phim ra mắt.',
        ],
        relatedNews: [
            { id: 'news05', title: 'MƯA ĐỎ” CÙNG CÁC BÁC CỰU CHIẾN BINH CHIẾN TRƯỜNG QUẢNG TRỊ TẠI COP CINEMA' },
            { id: 'news06', title: 'Lan tỏa lý tưởng cách mạng cho tuổi trẻ qua phim "Mưa đỏ"' }
        ]
    },

    {
        id: 'news05',
        title: '“MƯA ĐỎ” CÙNG CÁC BÁC CỰU CHIẾN BINH CHIẾN TRƯỜNG QUẢNG TRỊ TẠI COP CINEMA',
        date: '18/09/2025',
        thumbnail: '/assets/images/news/muado_1.jpg', // Ảnh đại diện danh sách
        intro: 'Ngày hôm nay, tại COP Cinema, chúng tôi vô cùng vinh dự được đón tiếp hơn một trăm Bác Cựu chiến binh - những người đã từng trực tiếp chiến đấu trên chiến trường Quảng Trị khốc liệt năm xưa - cùng nhau tham dự buổi chiếu đặc biệt bộ phim “Mưa Đỏ”.',
        images: [
            {
                src: '/assets/images/news/muado_1.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/muado_2.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/muado_3.jpg',
                caption: ''
            }
        ],
        paragraphs: [
            'Đây không chỉ là một buổi xem phim, mà còn là một cuộc trở về của ký ức, nơi lịch sử không còn nằm trên trang sách mà hiện lên bằng hình ảnh, âm thanh và bằng chính trái tim của những người đã sống, đã chiến đấu và đã hy sinh cho Tổ quốc.',
            'Trong từng thước phim, những ký ức hào hùng xen lẫn đau thương như sống dậy. Biết bao ánh mắt rưng rưng, những giọt nước mắt lặng lẽ rơi, những lời chia sẻ nghẹn ngào được cất lên, làm hiện rõ một thời máu lửa, gian khổ nhưng vô cùng anh dũng mà các Bác đã đi qua. Với thế hệ hôm nay, đó là khoảnh khắc để thấm thía sâu sắc giá trị của độc lập, tự do – những điều đã được đánh đổi bằng xương máu, tuổi trẻ và cả sinh mệnh của biết bao con người.',
            'Hòa bình không phải là điều hiển nhiên. Hòa bình là kết tinh của những hy sinh thầm lặng, của mồ hôi, nước mắt và máu xương của các thế hệ cha anh. Chính vì vậy, mỗi chúng ta hôm nay càng cần khắc ghi, trân trọng, gìn giữ và tiếp bước truyền thống vẻ vang ấy, để lịch sử không chỉ được nhớ đến, mà còn trở thành nguồn động lực bền vững soi sáng con đường hướng tới tương lai.'
        ],
        relatedNews: [
            { id: 'news06', title: 'Lan tỏa lý tưởng cách mạng cho tuổi trẻ qua phim "Mưa đỏ"' },
            { id: 'news07', title: 'TUYỂN DỤNG CỘNG TÁC VIÊN THÁNG 9 TẠI COP CINEMA' }
        ]
    },

    {
        id: 'news06',
        title: 'Lan tỏa lý tưởng cách mạng cho tuổi trẻ qua phim "Mưa đỏ"',
        date: '18/09/2025',
        thumbnail: '/assets/images/news/lantoa_1.jpg', // Ảnh đại diện danh sách
        intro: 'Đoàn Thanh niên Bộ Văn hóa, Thể thao và Du lịch phối hợp với các đơn vị Đoàn Thanh niên Chính phủ đã tổ chức Chương trình “Sinh hoạt chính trị, giáo dục lý tưởng cách mạng cho đoàn viên, thanh niên” thông qua phim truyện điện ảnh “Mưa Đỏ”.',
        images: [
            {
                src: '/assets/images/news/lantoa_1.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/lantoa_2.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/lantoa_4.jpg',
                caption: ''
            },
            {
                src: '/assets/images/news/lantoa_3.jpg',
                caption: ''
            }
        ],
        paragraphs: [
            'Chiều 12/9/2025, chương trình đã diễn ra trang trọng tại COP Cinema (Hà Nội) với sự tham dự và phát biểu chỉ đạo của Ủy viên dự khuyết Trung ương Đảng, Thứ trưởng Thường trực Bộ VHTTDL Lê Hải Bình, cùng sự có mặt của gần 1.000 đoàn viên, thanh niên đến từ các đơn vị.',
            'Chương trình không chỉ đơn thuần là một hoạt động giao lưu nghệ thuật, mà còn mang ý nghĩa giáo dục chính trị sâu sắc, góp phần giúp thế hệ trẻ hiểu rõ hơn về lịch sử dân tộc, về giá trị thiêng liêng của độc lập, tự do, từ đó chuyển hóa niềm tự hào dân tộc thành động lực học tập, rèn luyện, sáng tạo và cống hiến, chung tay xây dựng một Việt Nam hùng cường và thịnh vượng.',
            'Phát biểu chỉ đạo tại chương trình, Thứ trưởng Thường trực Bộ VHTTDL Lê Hải Bình ghi nhận và đánh giá cao sự chủ động, sáng tạo của Đoàn Thanh niên Bộ VHTTDL trong việc phối hợp tổ chức một chương trình có chiều sâu về tư tưởng và nghệ thuật, tạo sức lan tỏa mạnh mẽ đối với đoàn viên, thanh niên.'
        ],
        relatedNews: [
            { id: 'news07', title: 'TUYỂN DỤNG CỘNG TÁC VIÊN THÁNG 9 TẠI COP CINEMA' },
            { id: 'news01', title: 'ZOOTOPIA 2 chính thức trở lại sau 9 năm chờ đợi!' }
        ]
    },

    {
        id: 'news07',
        title: '🎬📣 TUYỂN DỤNG CỘNG TÁC VIÊN THÁNG 9 TẠI COP CINEMA',
        date: '10/09/2025',
        thumbnail: '/assets/images/news/tuyendung_1.jpg', // Ảnh đại diện danh sách
        intro: 'Nhằm bổ sung nhân sự phục vụ hoạt động chiếu phim và nâng cao chất lượng phục vụ khán giả, COP Cinema thông báo tuyển dụng Cộng tác viên tháng 9 dành cho các bạn trẻ yêu thích điện ảnh và mong muốn làm việc trong môi trường năng động, chuyên nghiệp.',
        images: [
            {
                src: '/assets/images/news/tuyendung_1.jpg',
                caption: ''
            }
        ],
        paragraphs: [
            'Các vị trí tuyển dụng bao gồm cộng tác viên soát vé, dẫn chỗ và bán vé. Đây là cơ hội để ứng viên được trực tiếp tham gia vào quy trình vận hành rạp chiếu phim, tiếp xúc với môi trường làm việc thực tế và rèn luyện các kỹ năng giao tiếp, xử lý tình huống cũng như tinh thần làm việc nhóm.',
            'Ứng viên tham gia tuyển dụng cần là công dân Việt Nam từ đủ 18 tuổi trở lên, có ngoại hình ưa nhìn, giao tiếp tốt; biết ngoại ngữ là một lợi thế. Bên cạnh đó, ứng viên cần có tác phong nhanh nhẹn, chăm chỉ, tinh thần trách nhiệm cao và có khả năng làm việc theo ca, bao gồm các ca tối muộn, cuối tuần cũng như các ngày Lễ, Tết.',
            'Thời gian làm việc tại COP Cinema được bố trí linh hoạt từ 8h00 sáng đến 1h30 đêm, chia thành bốn ca mỗi ngày. Cộng tác viên cần đảm bảo thời gian làm việc tối thiểu 25 giờ mỗi tuần, trong đó có Thứ Bảy, Chủ nhật và các ngày Lễ, Tết, đồng thời có thể đăng ký ca phù hợp với lịch cá nhân.'
        ],
        relatedNews: [
            { id: 'news01', title: 'ZOOTOPIA 2 chính thức trở lại sau 9 năm chờ đợi!' },
            { id: 'news02', title: 'CINETOUR “TAY ANH GIỮ MỘT VÌ SAO” tại COP Cinema' }
        ]
    },

];

export default NEWS_DATA;