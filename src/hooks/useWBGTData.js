name: Update Weather Data

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Fetch Weather Data
        run: |
          curl -o public/wbgt.json https://api.data.gov.sg/v1/environment/wet-bulb-globe-temperature
          curl -o public/temp.json https://api.data.gov.sg/v1/environment/air-temperature
          
      - name: Commit and Push
        run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add public/
          git diff --quiet && git diff --staged --quiet || git commit -m "Update weather data"
          git push
