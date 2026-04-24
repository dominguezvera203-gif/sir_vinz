api-quest app
Custom Gem
api-quest app said
For the API-Quest project, I built a multi-source dashboard that combines five different data streams—CoinGecko, NewsData.io (local and global news), NASA’s APOD, and Open-Meteo—into one unified “Intel Feed.” The goal of the app is to solve information overload by putting everything in one place, so users don’t need to switch between different apps or websites just to get daily updates like crypto prices, weather in Mati City, and international tech news.

The hardest part of building it was handling multiple API requests at the same time. I used Promise.all, which required careful work to organize and standardize the data because each API returns a different JSON format. I had to map all five sources into one consistent structure, and make sure that if one API failed, it wouldn’t break the whole app.

If I had more time, I would switch to Promise.allSettled so the dashboard can still load the available data even if one service is down. I would also add a caching system to reduce repeated requests, avoid hitting API limits, and make the app load faster.
