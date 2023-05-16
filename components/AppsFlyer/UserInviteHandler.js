import React, { useEffect } from 'react';
import { Share } from 'react-native';
import appsFlyer from "react-native-appsflyer";

const UserInviteHandler = (props) => {

    const { userInviteParams } = props;


    useEffect(() => {
        // set the tamplate ID before you generate a link.
        // Without it UserInvite won't work.
        appsFlyer.setAppInviteOneLinkID('scVs', null);
    }, [])


    // share the generted link to social platforms
    const shareGeneratedLink = (link) => {
        const referrerName = userInviteParams.referrerName;

        // get the referrer name. If the referrer name is empty, send the link with anonimus name.
        const capitalReferrerName = referrerName ?
            referrerName.charAt(0).toUpperCase() + referrerName.slice(1) :
            "Someone";

        const message = `Hey there! ${capitalReferrerName} has invited you to add items to your grocery list.\nClick on the link to download/open the app:\n${link}`;

        Share.share({ message })
            .then((result) => console.log(result))
            .catch((errorMsg) => console.log(errorMsg));
    };


    useEffect(() => {
        // generate link if userInviteParams object is not empty
        if (Object.keys(userInviteParams).length > 0) {
            appsFlyer.generateInviteLink({
                campaign : 'your_campain',
                userParams: {
                    // your params
                    deep_link_value: userInviteParams.categoryName,
                    deep_link_sub1: userInviteParams.itemName,
                    deep_link_sub2: userInviteParams.unitsMode,
                    deep_link_sub3: userInviteParams.quantity,
                    deep_link_sub4: userInviteParams.referrerName
                }
            }, (link) => {
                shareGeneratedLink(link);
            }, (err) => {
                console.log(err);
            });
        }
    }, [userInviteParams]);

    return null;
};

export default UserInviteHandler;