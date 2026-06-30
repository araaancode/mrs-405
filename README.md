This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

//**************************** project structure ****************************//
app/
  auth/
    login/page.js
    register/
      hall-owner/page.js
      property-owner/page.js
      bus-owner/page.js
      food-provider/page.js
      user/page.js

  halls/
    page.js
    [id]/
      page.js
      reviews/page.js

  properties/
    page.js
    [id]/
      page.js
      reviews/page.js

  buses/
    page.js
    [id]/page.js

  foods/
    page.js
    [id]/page.js

  booking/
    page.js
    [id]/page.js
    confirmation/page.js

  search/
    page.js

  dashboard/
    admin/
      page.js
      requests/page.js
      stats/page.js
      financial/page.js
      payouts/page.js
      refunds/page.js
      support/page.js

    hall-owner/
      page.js
      listings/page.js
      bookings/page.js
      financial/page.js
      calendar/page.js
      support/page.js
      reviews/page.js

    property-owner/
      page.js
      listings/page.js
      bookings/page.js
      financial/page.js
      calendar/page.js
      support/page.js
      reviews/page.js

    bus-owner/
      page.js
      listings/page.js
      bookings/page.js
      support/page.js

    food-provider/
      page.js
      listings/page.js
      bookings/page.js
      support/page.js

    user/
      page.js
      bookings/page.js
      reviews/page.js
      support/page.js

  agreements/
    host/page.js
    user/page.js

  api/
    auth/[...nextauth]/route.js

    auth/
      register/hall-owner/route.js
      register/property-owner/route.js
      register/bus-owner/route.js
      register/food-provider/route.js
      register/user/route.js

    halls/
      route.js
      [id]/route.js
      availability/[id]/route.js
      reviews/[id]/route.js

    properties/
      route.js
      [id]/route.js
      availability/[id]/route.js
      reviews/[id]/route.js

    buses/
      route.js
      [id]/route.js

    foods/
      route.js
      [id]/route.js

    bookings/
      route.js
      [id]/route.js

    payments/
      route.js
      verify/route.js
      admin/refund/route.js
      admin/payout/route.js

    tickets/
      route.js
      [id]/route.js

    admin/
      requests/route.js
      stats/route.js
      approvals/route.js
      financial/route.js
      payouts/route.js
      refunds/route.js
      support/route.js

