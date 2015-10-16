## Parser

* Node v4.2.1

# How to run

Clone this repository, run

```
npm install
```

Download and extract public Enron email dataset [here](https://www.cs.cmu.edu/~./enron/)

```
node parser.js '/Users/admin/Downloads/maildir/' #notice that the path is a string
```

This will create a bunch of .json files in `export` folder. Then, make sure that Elasticsearch is running on `localhost:9200` (by default) and run

```
node import.js
```

That's it!