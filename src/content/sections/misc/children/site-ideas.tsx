import React from "react";
import { ISectionComponentProps } from "@types";

export const title = 'site ideas';

export const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>ideas</h2>
      <h3>what else can i put on this site</h3>
      <ul>
        <li>emoji art gallery</li>
        <li>dream journal</li>
        <li>interactive virtual altar!!</li>
        <li>shrines to things i like</li>
        <li>multiple site themes</li>
        <li>soundcloud</li>
        <li>guestbook or thing where people can say hi or contribute in some way</li>
        <li>polls!! anytime I want community input on a decision or just for fun</li>
        <li>or more open ended suggestion box like toad names ideas etc</li>
        <li>my criminal minds episode script</li>
        <li>earthquake/volcano tracker</li>
        <li>list of wikipedia contributions</li>
        <li>site affiliates if i can find other people with similar things</li>
        <li>easter eggs everywhere</li>
      </ul>
      <h3>code/art/theory intensive</h3>
      <ul>
        <li>mini MMO if I can figure out how to get <a href="https://vercel.com/guides/deploying-pusher-channels-with-vercel" target="_blank">websockets working on vercel</a></li>
        <li>closet organizer like on clueless where visitors can create outfits from my OWN WARDROBE and send them to me as suggestions</li>
        <li>tamagotchi simulator</li>
        <li>naomi's magic beans... one day</li>
      </ul>
      <h3>theme ideas</h3>
      <ul>
        <li>EV style pixel art town</li>
      </ul>
    </>
  )
}