import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string, @Query('type') type?: string) {
    if (!query || query.trim().length < 2) {
      return {
        categories: [],
        products: [],
        total: 0
      };
    }

    const results = await this.searchService.search(query.trim(), type);
    return results;
  }

  @Get('suggestions')
  async getSuggestions(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const suggestions = await this.searchService.getSuggestions(query.trim());
    return suggestions;
  }
}
