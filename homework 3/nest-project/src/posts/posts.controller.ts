import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createPost(@Body() createPostDto: CreatePostDto,
               @UploadedFile() image) {
        try {
            return this.postService.create(createPostDto, image);
        } catch (error) {
            console.log(error);
        }
        
    }
}
