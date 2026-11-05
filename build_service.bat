:: cd uifd/service/
:: goreleaser --snapshot --clean
:: cd ..
:: go build ./build_service
:: build_service
:: del build_service.exe
:: goreleaser --snapshot --clean
:: rmdir uifd_dist /s /q
:: rmdir webs_dist /s /q

cd uifd
go build -o uif_service.exe  ./service
