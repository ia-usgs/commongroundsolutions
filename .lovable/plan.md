# Fix missing sign-up notification emails

## What I found
- The last two sign-ups (Sep 26 and Sep 27) **did save**. They appear in the admin panel and are marked confirmed, so no student data was lost.
- The notification email is sent from the student's own browser to Web3Forms after the sign-up saves. The site never checks whether Web3Forms accepted it. If it fails, nobody finds out.
- Common reasons this silently fails:
  - The student's browser, ad blocker, or privacy setting blocks the Web3Forms request (common on iPhone Safari and Brave).
  - Web3Forms rejects the send, either because the free plan's monthly limit ran out or because its spam filter flagged the long waiver text.
  - The email arrives but lands in Gmail spam or Promotions.

## Plan
1. **Send the email from the server instead of the browser.** The sign-up function that already saves the student will also send the Web3Forms email. Browser blockers can no longer stop it.
2. **Check the result.** If Web3Forms refuses the send, record the reason so we can see why (for example "limit reached" or "spam").
3. **Add an "email sent" status for each sign-up in admin**, so you can see at a glance whether the notification went out.
4. **Do the same for the Rifle Data email** used by American Rifleman I.
5. **Test it:** make one test sign-up, confirm the email arrives, then delete the test sign-up.

## Things for you to check now
- Look in the Gmail spam and Promotions folders for emails with the subject "Signed Waiver —" from Sep 26–27.
- Check your Web3Forms dashboard for a monthly-limit warning.

## Technical details
- Move the FormData build from `SignupModal.tsx` into `supabase/functions/create-signup/index.ts` after the insert succeeds. Check the JSON returned by `api.web3forms.com/submit` (`success`), and log failures.
- Add columns `notification_sent boolean` and `notification_error text` to `signups`. Show them as a badge in the admin sign-ups list.
- Pass class name and price info to the function, or look them up there.
- Rifle data: move the email into the rifle data RPC path through a small edge function, or keep it in the browser but check the response.
