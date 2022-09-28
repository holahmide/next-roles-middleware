#

Hi, hope you are doing well. I guess you have implemented authentication and you are looking to implement authorization in your nextJS app, to give and restrict access to different pages and functionalities in your application. Well welcome here, i wrote a simple function to help you with that.

I created a function that takes in the authenticated user roles, a configuration of path roles and the pathname to check for, then returns a boolean if the user is allowed or not.

When implementing this I placed the function in my application's global state where i could access the user roles and also export this function to use anywhere in my application. Lets get started!

## The configuration object
This object takes in `key: value pairs` where the `keys` are nextjs pathnames joined with a `-` and the values are arrays of the required roles. An example is given below.
```typescript
type Roles = 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

const pathRoles: { [key: string]: [Roles] } = {
  'edit-[blog]': ['ADMIN'],
  create: ['EDITOR']
};
```

From the type definition we specified 3 types of roles and in the object we attached an array of roles to  specific pathnames. Please note that you don't have to specify a configuration for paths that do not require any role. You are probably asking if you would have to specify a configuration for all the routes in your application, but we will see how the function takes care of that in the next section.

## The `checkIfUserIsAllowed` function
So create this function in your application, i suggest in your application global store or your user store.
### Declaring the function
```typescript
const checkIfUserIsAllowed = (pathname: string, userRoles: [Roles]  = state.user.roles) => {}
```
The function takes in two parameters
1. The first parameter is the `pathname` that you want to check the users accessibility for.
2. The second parameter is the `userRoles` array which is an optional parameter which takes in an array of the currently authenticated user and defaults to to roles contained in your user store assumed to be `state.user.roles`.

### Useful Variables in our function
```typescript
const checkIfUserIsAllowed = (pathname: string, userRoles: [Roles]  = state.user.roles) => {
    const paths = pathname.split('/').filter((i: any) => i); // Split Current path name
    const pathRolesKeys = Object.keys(pathRoles); // get the paths that permission was set for
    let requiredRoles: string[] = []; // initializes path required roles
    let allowed: boolean = true; // makes the function return a default of true
}
```

The first variable `paths` splits the pathname passed by `/` i.e if you pass `/edit/[blog]` it gets splitted into `['edit', '[blogs]']`. The second variable gets the paths specified in the pathRoles object by getting the keys which are paths concatinated with `-` for accuracy purposes. THe last two variables will be used later in the function.

### Recursively checking for path configuration
```typescript
const checkIfUserIsAllowed = (pathname: string, userRoles: [Roles]  = state.user.roles) => {
    const paths = pathname.split('/').filter((i: any) => i); // Split Current path name
    const pathRolesKeys = Object.keys(pathRoles); // get the paths that permission was set for
    let requiredRoles: string[] = []; // initializes path required roles
    let allowed: boolean = true; // makes the function return a default of true

    while (paths.length > 0 && requiredRoles.length === 0) {
        const key: any = paths.join('-');
        if (pathRolesKeys.includes(key)) requiredRoles = pathRoles[key];
        else paths.pop();
    }
}
```
The next part of the function `while loop` concatinates the the splitted paths with `-` to correspond with the keys of the configuration object `pathRoles`. It finds the last specified roles  for a part, for example given a path `edit/[blog]` it becomes `edit-[blog]`, the function checks if a configuration was specified for this, if it was set then it fetches the roles specified and stores it in the `requiredRoles` array, if not the removes the last path in the pathname an checks for the next path. In our case it removes `/[blog]` and checks for `edit`. It contunues in this loop till there is not path left.

This means
1. Specifying roles for a parent route will be applied for all children routes, so it can save the stress of having to specify for all the routes in your project.
2. If a configuration cannot be found it is assumed the pathname does not have any associated role authorization and the `requiredRoles` remains empty.


### Check if user has all the roles
```typescript
const checkIfUserIsAllowed = (pathname: string, userRoles: Roles[]  = state.user.roles) => {
      const paths = pathname.split('/').filter((i: any) => i); // Split Current path name
      const pathRolesKeys = Object.keys(pathRoles); // get the paths that permission was set for
      let requiredRoles: Roles[] = []; // initializes path required roles
      let allowed: boolean = true; // makes the function return a default of true

      while (paths.length > 0 && requiredRoles.length === 0) {
        const key: any = paths.join('-');
        if (pathRolesKeys.includes(key)) requiredRoles = pathRoles[key];
        else paths.pop();
      }
      if (userRoles.includes('SUPER_ADMIN')) return true;
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.every((item: Roles) => userRoles.includes(item))
      )
        allowed = false;

      return allowed;
}
```

The last part of the function checks if the user has all the required arrays and sets the allowed variable to false if not, then returns the allowed varaiables. It also has an exception to make all page accessible to all  `SUPER_ADMIN`.

So you can call this function from anywhere in your app by passing the pathname, and getting a boolean response. A common additional use case is to conditionally render navigation links for users with restricted access to certain oages in your application.

I hope you found this article helpful😎, if you did please drop a message at the comment section I will like to now how you implemented it in your function.

You can take a loop at how i implemented it in a simple application here [blog-admin-app](https://github.com/holahmide/next-middleware-article)

