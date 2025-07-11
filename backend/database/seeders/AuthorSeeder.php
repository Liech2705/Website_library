<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            [
                'name' => 'Nguyễn Bích Lan',
                'bio' => 'Nhà văn, dịch giả nổi tiếng với nhiều tác phẩm văn học được yêu thích. Bà được biết đến với khả năng viết lách tinh tế và sâu sắc.'
            ],
            [
                'name' => 'Tô Yến Ly',
                'bio' => 'Tác giả trẻ với phong cách viết hiện đại, chuyên về thể loại tiểu thuyết đương đại và truyện ngắn.'
            ],
            [
                'name' => 'Phạm Văn Bình',
                'bio' => 'Nhà nghiên cứu và tác giả chuyên về lĩnh vực giáo dục và phát triển bản thân.'
            ],
            [
                'name' => 'Nguyễn Văn Toàn',
                'bio' => 'Tác giả chuyên viết về lịch sử và văn hóa Việt Nam với nhiều công trình nghiên cứu có giá trị.'
            ],
            [
                'name' => 'Lê Thị Hằng',
                'bio' => 'Nhà văn nữ với nhiều tác phẩm về phụ nữ và gia đình, được độc giả yêu mến.'
            ],
            [
                'name' => 'Ngô Nhật Hào',
                'bio' => 'Tác giả trẻ với phong cách viết sáng tạo, chuyên về thể loại khoa học viễn tưởng và fantasy.'
            ],
            [
                'name' => 'Trần Quốc Dũng',
                'bio' => 'Nhà văn, nhà báo với nhiều tác phẩm phản ánh hiện thực xã hội một cách chân thực.'
            ],
            [
                'name' => 'Lê Quang Hưng',
                'bio' => 'Tác giả chuyên về thể loại truyện trinh thám và tiểu thuyết hình sự.'
            ],
            [
                'name' => 'Diễm My',
                'bio' => 'Nhà văn nữ với phong cách viết lãng mạn, chuyên về thể loại tình cảm và gia đình.'
            ],
            [
                'name' => 'Phan Minh Thái',
                'bio' => 'Tác giả chuyên về lĩnh vực kinh doanh và phát triển doanh nghiệp với nhiều cuốn sách bestseller.'
            ],
            [
                'name' => 'Lê Thảo',
                'bio' => 'Nhà văn trẻ với phong cách viết hiện đại, chuyên về thể loại văn học đương đại.'
            ],
            [
                'name' => 'Phạm Như Lan',
                'bio' => 'Tác giả chuyên về lĩnh vực tâm lý học và phát triển cá nhân.'
            ],
            [
                'name' => 'Đặng Văn Hòa',
                'bio' => 'Nhà văn với nhiều tác phẩm về nông thôn và đời sống người dân Việt Nam.'
            ],
            [
                'name' => 'Trịnh Văn Tùng',
                'bio' => 'Tác giả chuyên về lĩnh vực công nghệ và đổi mới sáng tạo.'
            ],
            [
                'name' => 'Nguyễn Hồng Phúc',
                'bio' => 'Nhà văn với phong cách viết hài hước, chuyên về thể loại truyện cười và văn học giải trí.'
            ],
            [
                'name' => 'Nguyễn Quang Tèo',
                'bio' => 'Tác giả chuyên về lĩnh vực ẩm thực và văn hóa ẩm thực Việt Nam.'
            ],
            [
                'name' => 'Daniel Kahneman',
                'bio' => 'Nhà tâm lý học người Israel, đoạt giải Nobel Kinh tế năm 2002. Ông là tác giả của nhiều cuốn sách về tâm lý học và kinh tế học hành vi.'
            ],
            [
                'name' => 'Lê Văn Thành',
                'bio' => 'Tác giả chuyên về lĩnh vực quản lý và lãnh đạo với nhiều năm kinh nghiệm trong ngành.'
            ],
            [
                'name' => 'Trần Thị Mai',
                'bio' => 'Nhà văn nữ với nhiều tác phẩm về phụ nữ hiện đại và các vấn đề xã hội.'
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
