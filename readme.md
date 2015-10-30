# Enron email search

[Read more](https://www.cs.cmu.edu/~./enron/) about the dataset. [What is Enron?](https://en.wikipedia.org/wiki/Enron)

## Prerequisites

* Node > 4.0
* Downloaded enron email dataset

## How to run

Clone the repository, run

```
npm install
```

Download and extract public Enron email dataset [here](https://www.cs.cmu.edu/~./enron/). Parse the dataset with:

```
node parser.js /Users/admin/Downloads/maildir/
```

This will create a bunch of .json files in `export` folder. Then, make sure that Elasticsearch is running on `localhost:9200` (by default) and run

```
node import.js
```

Now all json files are imported in elastic. To run search UI, run

```
npm start
#OR
node server.js
```

and navigate to `localhost:3000` in your web browser.

Enjoy!