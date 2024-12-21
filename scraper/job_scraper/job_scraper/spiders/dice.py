import scrapy


class DiceSpider(scrapy.Spider):
    name = "dice"
    allowed_domains = ["dice.com"]
    start_urls = ["https://dice.com"]

    def parse(self, response):
        pass
