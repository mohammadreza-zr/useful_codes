import { INode } from "@interfaces";
import { useAppDispatch } from "@store";
import { deleteRoleNode, editRoleNode } from "pages/setting/roles/slice";
import { useState } from "react";

const Node = ({ node }: any) => {
  const [showDetail, setShowDetail] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  return node?.map((item: any) => {
    const hasChild = item?.child?.length > 0;

    return (
      <div
        key={item._id}
        className={`row-detail-price w-100 ${hasChild ? "subline-price" : ""}`}
        style={{ paddingRight: "3rem", marginBottom: "0.5rem" }}
      >
        <div
          onClick={() => {
            if (showDetail.includes(item._id)) {
              setShowDetail(showDetail.filter((m) => m !== item._id));
            } else {
              setShowDetail([...showDetail, item._id]);
            }
          }}
          className={`price-box bg-white border bsh-main rounded-12 pd-5 d-flex align-items-center justify-content-between ${
            hasChild ? "pointer" : ""
          }`}
        >
          <div className="title-box d-flex align-items-center">
            <span className="text-dark-gray font-size-12 fw-bold mgr-5">{item?.title}</span>
          </div>

          <div className="options-box d-flex align-items-center justify-content-end">
            <button
              className="btn-table btn-edit grd-gray-rotate text-white mgx-2"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(editRoleNode(item));
              }}
            >
              <i
                className="icon-pencil w-100 h-100 d-flex align-items-center justify-content-center"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                data-original-title="ویرایش"
              ></i>
            </button>
            {!hasChild && (
              <button
                className="btn-table btn-view grd-gray-rotate text-white mgx-2"
                data-toggle="modal"
                data-target="#md_del_store"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteRoleNode(item?._id));
                }}
              >
                <i
                  className="icon-trash w-100 h-100 d-flex align-items-center justify-content-center"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="حذف"
                ></i>
              </button>
            )}
          </div>
        </div>
        {showDetail.includes(item._id) &&
          hasChild &&
          item?.child?.map((el: any, inx: number) => {
            const hasChild = el?.child?.length > 0;

            return (
              <div key={inx} onClick={(e) => e.stopPropagation()}>
                <div
                  className={`row-detail-price product-price w-100 pdr-30 ${
                    hasChild ? "pointer" : ""
                  }`}
                  onClick={() => {
                    if (hasChild) {
                      if (showDetail.includes(el._id)) {
                        setShowDetail(showDetail.filter((m) => m !== el._id));
                      } else {
                        setShowDetail([...showDetail, el._id]);
                      }
                    }
                  }}
                >
                  <div className="price-box bg-white border bsh-main rounded-12 pd-5 d-flex align-items-center justify-content-between">
                    <div className="title-box d-flex align-items-center">
                      <span className="text-dark-gray font-size-12 fw-bold mgr-5">{el?.title}</span>
                    </div>

                    <div className="options-box d-flex align-items-center justify-content-end">
                      <button
                        className="btn-table btn-edit grd-gray-rotate text-white mgx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(editRoleNode(el));
                        }}
                      >
                        <i
                          className="icon-pencil w-100 h-100 d-flex align-items-center justify-content-center"
                          data-toggle="tooltip"
                          data-placement="top"
                          title=""
                          data-original-title="ویرایش"
                        ></i>
                      </button>
                      {!hasChild && (
                        <button
                          className="btn-table btn-view grd-gray-rotate text-white mgx-2"
                          data-toggle="modal"
                          data-target="#md_del_store"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteRoleNode(el?._id));
                          }}
                        >
                          <i
                            className="icon-trash w-100 h-100 d-flex align-items-center justify-content-center"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="حذف"
                          ></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {showDetail.includes(el._id) && hasChild && <Node node={el.child} />}
              </div>
            );
          })}
      </div>
    );
  });
};

export const NodeTree = ({ node }: { node?: INode }) => {
  const [showDetail, setShowDetail] = useState(false);
  const hasChild = (node?.child?.length ?? -1) > 0;

  return (
    <>
      <div className="row-detail-price headline-price w-100">
        <div className="price-box bg-white border bsh-main rounded-12 pdy-10 pdx-5 d-flex align-items-center justify-content-between">
          <div className="title-box d-flex align-items-center pdr-5">
            <div
              className={`arrow-headline ${showDetail && "active"}`}
              onClick={() => setShowDetail(!showDetail)}
            >
              <i className="icon-arrow"></i>
            </div>
            <span className="text-dark-gray font-size-12 fw-bold">{node?.title}</span>
          </div>
        </div>
      </div>
      {showDetail && hasChild ? <Node node={node?.child} /> : null}
    </>
  );
};
