export class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);
  
    const mongoFilter: any = {};
  
    for (const key in queryObj) {
      const value = queryObj[key];
  
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!mongoFilter[field]) mongoFilter[field] = {};
        mongoFilter[field][operator] = Number(value);
      } else {
        mongoFilter[key] = value;
      }
    }
  
    this.query = this.query.find(mongoFilter);
    return this;
  }
  

  search(fieldName: string) {
    if (this.queryString.search) {
      this.query = this.query.find({
        [fieldName]: {
          $regex: this.queryString.search,
          $options: "i",
        },
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 25;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
