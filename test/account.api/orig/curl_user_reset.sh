SERVER_HOST=admin.bfreetest.com:3000
#SERVER_HOST=admin.versafiledev.com

echo LOGON
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -d "{\"email\":\"cmburns@snpp.com\",\"password\":\"bobo\"}" \
    http://$SERVER_HOST/accounts/logon
echo
echo ================================================
echo
echo

echo GET TOKEN
echo ================================================
auth_token=$( \
    curl \
        -v \
        -b cookies.txt \
        -c cookies.txt \
        -H "Accept:application/json,application/javascript" \
        -H "Content-Type:application/json" \
        http://$SERVER_HOST/accounts/get_token \
)
echo
echo ================================================
echo
echo

echo RESET PASSWORD - OK
echo =============================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X POST \
    -d "{ \"authenticity_token\":\"$auth_token\" }" \
    http://$SERVER_HOST/accounts/cmburns@snpp.com/reset_password
echo
echo ================================================
echo
echo

echo RESET PASSWORD - NO ACCESS
echo =============================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X POST \
    -d "{ \"authenticity_token\":\"$auth_token\" }" \
    http://$SERVER_HOST/accounts/anahasapeemapetilon@kwikemart.com/reset_password
echo
echo ================================================
echo
echo

echo LOGOFF
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    http://$SERVER_HOST/accounts/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt
